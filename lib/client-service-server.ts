import { createClient } from '@/integrations/supabase/server/client'
import type { Client } from './client-service'

// Get all clients for the current user
export const getUserClients = async (): Promise<Client[]> => {
	try {
		const supabaseServer = await createClient()
		const {
			data: { user },
		} = await supabaseServer.auth.getUser()

		if (!user) {
			return []
		}

		const query = supabaseServer
			.from('clients')
			.select('*')
			.eq('user_id', user.id)
			.order('name', { ascending: true })

		const { data, error } = await query

		if (error) {
			console.error('Error fetching clients:', error)
			return []
		}

		return data as Client[]
	} catch (error) {
		console.error('Error fetching clients:', error)
		return []
	}
}



// Get invoice counts for all clients
export const getInvoiceCountsForClients = async (
	clientNames: string[],
): Promise<Record<string, number>> => {
	try {
		const supabaseServer = await createClient()
		const {
			data: { user },
		} = await supabaseServer.auth.getUser()

		if (!user || clientNames.length === 0) {
			return {}
		}

		const { data, error } = await (supabaseServer)
			.from('invoices')
			.select('client_name')
			.eq('user_id', user.id)
			.in('client_name', clientNames)

		if (error) {
			console.error('Error fetching invoice counts for clients:', error)
			return {}
		}

		// Count invoices per client
		const counts: Record<string, number> = Object.fromEntries(
			clientNames.map((name) => [name, 0]),
		)

		data.forEach((invoice: { client_name: string }) => {
			counts[invoice.client_name] = (counts[invoice.client_name] || 0) + 1
		})

		return counts
	} catch (error) {
		console.error('Error fetching invoice counts for clients:', error)
		return {}
	}
}