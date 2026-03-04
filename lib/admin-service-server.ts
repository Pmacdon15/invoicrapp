import { createClient } from '@/integrations/supabase/server/client'
import type { AdminAnalytics } from './admin-service'

export async function isAdmin(): Promise<boolean> {
	try {
		const supabase = await createClient()
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()
		if (error || !user) return false

		const { data, error: profileError } = await supabase
			.from('profiles')
			.select('role')
			.eq('user_id', user.id)
			.single()

		if (profileError) {
			// If there's an error, it might be because the profile doesn't exist yet
			// or the user doesn't have admin privileges. Return false.
			console.debug(
				'Profile not found or not accessible:',
				profileError.message,
			)
			return false
		}
		return data?.role === 'admin' || data?.role === 'super_admin'
	} catch (error) {
		console.error('Error checking admin status:', error)
		return false
	}
}

export async function getAdminAnalytics(): Promise<AdminAnalytics | null> {
	try {
		const supabase = await createClient()
		// First update the analytics
		await supabase.rpc('update_admin_analytics')

		// Then fetch the latest data
		const { data, error } = await supabase
			.from('admin_analytics')
			.select('*')
			.order('date', { ascending: false })
			.limit(1)
			.single()

		if (error) {
			console.error('Error fetching admin analytics:', error)
			return null
		}

		return {
			date: data.date,
			totalUsers: data.total_users,
			newUsersToday: data.new_users_today,
			activeUsersLast7Days: data.active_users_last_7_days,
			activeUsersLast30Days: data.active_users_last_30_days,
			totalInvoices: data.total_invoices,
			invoicesCreatedToday: data.invoices_created_today,
			invoicesCreatedThisWeek: data.invoices_created_this_week,
			invoicesCreatedThisMonth: data.invoices_created_this_month,
			totalRevenue: Number(data.total_revenue),
			revenueToday: Number(data.revenue_today),
			revenueThisWeek: Number(data.revenue_this_week),
			revenueThisMonth: Number(data.revenue_this_month),
			freeUsers: data.free_users,
			proUsers: data.pro_users,
			totalClients: data.total_clients,
			avgInvoicesPerUser: Number(data.avg_invoices_per_user),
			createdAt: data.created_at,
			updatedAt: data.updated_at,
		}
	} catch (error) {
		console.error('Error getting admin analytics:', error)
		return null
	}
}
