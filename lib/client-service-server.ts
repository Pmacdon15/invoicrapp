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
