import { createClient } from '@/integrations/supabase/server/client'
import type { InvoiceAnalytics, SavedInvoice } from './invoice-service'

// Get a specific invoice by ID - Server Side
export const getInvoiceById = async (
	id: string,
): Promise<SavedInvoice | null> => {
	try {
		console.log('id: ', id)
		const supabaseServer = await createClient()
		const {
			data: { user },
			error: userError,
		} = await supabaseServer.auth.getUser()

		if (!user) {
			console.log('User not authenticated in getInvoiceById:', userError)
			return null
		}
		console.log(user)

		const { data, error } = await supabaseServer
			.from('invoices')
			.select('*')
			.eq('id', id)
			.eq('user_id', user.id)
			.single()

		if (error) {
			// console.error('Error fetching invoice:', error)
			return null
		}

		return data as SavedInvoice
	} catch (error) {
		console.error('Error fetching invoice:', error)
		return null
	}
}

// Get all invoices for the current user
export const getUserInvoices = async (): Promise<SavedInvoice[]> => {
	try {
		const supabaseServer = await createClient()
		const {
			data: { user },
		} = await supabaseServer.auth.getUser()

		if (!user) {
			return []
		}

		const { data, error } = await supabaseServer
			.from('invoices')
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })

		if (error) {
			// console.error('Error fetching invoices:', error)
			return []
		}

		return data as SavedInvoice[]
	} catch (error) {
		console.error('Error fetching invoices:', error)
		return []
	}
}

export const getInvoiceAnalytics = async (
	period: '30days' | '6months' | '1year' = '6months',
): Promise<InvoiceAnalytics | null> => {
	try {
		const supabaseServer = await createClient()
		const {
			data: { user },
		} = await supabaseServer.auth.getUser()

		if (!user) {
			return null
		}

		// Calculate date filter based on period
		const now = new Date()
		let dateFilter: string

		switch (period) {
			case '30days':
				dateFilter = new Date(
					now.getTime() - 30 * 24 * 60 * 60 * 1000,
				).toISOString()
				break
			case '6months':
				dateFilter = new Date(
					now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000,
				).toISOString()
				break
			case '1year':
				dateFilter = new Date(
					now.getTime() - 365 * 24 * 60 * 60 * 1000,
				).toISOString()
				break
			default:
				dateFilter = new Date(
					now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000,
				).toISOString()
		}

		const { data: invoices, error } = await supabaseServer
			.from('invoices')
			.select('*')
			.eq('user_id', user.id)
			.gte('created_at', dateFilter)
			.order('created_at', { ascending: false })

		if (error) {
			console.error('Error fetching analytics data:', error)
			return null
		}

		const totalInvoices = invoices.length
		const totalRevenue = invoices.reduce(
			(sum: number, inv: SavedInvoice) =>
				inv.status === 'paid' ? sum + inv.total_amount : sum,
			0,
		)

		const paidInvoices = invoices.filter(
			(inv: SavedInvoice) => inv.status === 'paid',
		).length
		const pendingInvoices = invoices.filter(
			(inv: SavedInvoice) =>
				inv.status === 'draft' || inv.status === 'sent',
		).length
		const overdueInvoices = invoices.filter(
			(inv: SavedInvoice) => inv.status === 'overdue',
		).length

		const averageInvoiceValue =
			totalInvoices > 0
				? invoices.reduce(
						(sum: number, inv: SavedInvoice) =>
							sum + inv.total_amount,
						0,
					) / totalInvoices
				: 0

		// Monthly revenue calculation
		const monthlyData: Record<string, { revenue: number; count: number }> =
			{}
		invoices.forEach((inv: SavedInvoice) => {
			const month = new Date(inv.created_at).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
			})
			if (!monthlyData[month]) {
				monthlyData[month] = { revenue: 0, count: 0 }
			}
			if (inv.status === 'paid') {
				monthlyData[month].revenue += inv.total_amount
			}
			monthlyData[month].count += 1
		})

		const monthlyRevenue = Object.entries(monthlyData)
			.map(([month, data]) => ({ month, ...data }))
			.slice(0, 6)

		// Status breakdown
		const statusCounts: Record<string, number> = {}
		invoices.forEach((inv: SavedInvoice) => {
			statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1
		})

		const statusBreakdown = Object.entries(statusCounts).map(
			([status, count]) => ({
				status,
				count,
				percentage:
					totalInvoices > 0 ? (count / totalInvoices) * 100 : 0,
			}),
		)

		// Top clients
		const clientData: Record<
			string,
			{ totalRevenue: number; invoiceCount: number }
		> = {}
		invoices.forEach((inv: SavedInvoice) => {
			if (!clientData[inv.client_name]) {
				clientData[inv.client_name] = {
					totalRevenue: 0,
					invoiceCount: 0,
				}
			}
			if (inv.status === 'paid') {
				clientData[inv.client_name].totalRevenue += inv.total_amount
			}
			clientData[inv.client_name].invoiceCount += 1
		})

		const topClients = Object.entries(clientData)
			.map(([name, data]) => ({ name, ...data }))
			.sort((a, b) => b.totalRevenue - a.totalRevenue)
			.slice(0, 5)

		// Recent activity
		const recentActivity = invoices
			.slice(0, 10)
			.map((inv: SavedInvoice) => ({
				date: inv.updated_at,
				action: `Invoice ${inv.status}`,
				invoice: inv.invoice_number,
				amount: inv.total_amount,
			}))

		return {
			totalInvoices,
			totalRevenue,
			paidInvoices,
			pendingInvoices,
			overdueInvoices,
			averageInvoiceValue,
			monthlyRevenue,
			statusBreakdown,
			topClients,
			recentActivity,
		}
	} catch (error) {
		console.error('Error fetching analytics:', error)
		return null
	}
}
