'use server'

import { supabase } from '@/integrations/supabase/old/client'
import { createClient } from '@/integrations/supabase/server/client'
import type { Client, CreateClientData } from '@/lib/client-service'
import { revalidatePath } from 'next/cache'

// Update an existing client
export const updateClient = async (
	id: string,
	updates: Partial<CreateClientData>,
): Promise<Client | null> => {
	try {
		const supabaseServer = await createClient()
		const {
			data: { user },
		} = await supabaseServer.auth.getUser()

		if (!user) {
			return null
		}

		const { data, error } = await supabaseServer
			.from('clients')
			.update(updates)
			.eq('id', id)
			.eq('user_id', user.id)
			.select()
			.single()

		if (error) {
			console.error('Error updating client:', error)
			return null
		}
		revalidatePath('/dashboard/clients')
		return data as Client
	} catch (error) {
		console.error('Error updating client:', error)
		return null
	}
}

export const deleteClient = async (
	id: string,
	hardDelete: boolean = false,
): Promise<boolean> => {
	try {
		const supabaseServer = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (!user) {
			return false
		}

		if (hardDelete) {
			const { error } = await supabaseServer
				.from('clients')
				.delete()
				.eq('id', id)
				.eq('user_id', user.id)

			if (error) {
				console.error('Error deleting client:', error)
				return false
			}
		} else {
			// Soft delete
			const { error } = await supabaseServer
				.from('clients')
				.update({ is_active: false })
				.eq('id', id)
				.eq('user_id', user.id)

			if (error) {
				console.error('Error deactivating client:', error)
				return false
			}
		}

		return true
	} catch (error) {
		console.error('Error deleting client:', error)
		return false
	}
}
