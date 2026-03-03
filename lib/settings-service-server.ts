import type { User } from '@supabase/supabase-js'
import { createClient } from '@/integrations/supabase/server/client'
import type { UserSettings } from '@/types/settings'
import { UserProfile } from '@/components/Profile'

export async function getUserSettings(): Promise<UserSettings | null> {
	try {
		const supabaseServer = await createClient()

		const {
			data: { user },
		} = await supabaseServer.auth.getUser()

		if (!user) {
			return null
		}
		const { data, error } = await supabaseServer
			.from('user_settings')
			.select('*')
			.eq('user_id', user.id)
			.single()

		// console.log('User Settings: ', data)
		if (error) {
			if (error.code === 'PGRST116') {
				// No settings found, return null
				return null
			}
			// throw error
		}

		return data
	} catch (error) {
		console.error('Error fetching user settings:', error)
		throw error
	}
}

export async function getUser(): Promise<User | null> {
	try {
		const supabaseServer = await createClient()

		const {
			data: { user },
			error,
		} = await supabaseServer.auth.getUser()

		if (error) {
			return null
		}

		return user
	} catch (e: unknown) {
		console.error('Error Fetching user: ', e)
		// We return null instead of throwing to avoid crashing Server Components
		return null
	}
}

export async function getUserProfile(): Promise<UserProfile | null> {
	try {
		const supabaseServer = await createClient()

		const {
			data: { user },
		} = await supabaseServer.auth.getUser()

		if (!user) {
			return null
		}
		// Load user profile from profiles table (if it exists)
		const { data, error } = await supabaseServer
			.from('profiles')
			.select('*')
			.eq('user_id', user.id)
			.single()

		// console.log('User Settings: ', data)
		if (error) {
			if (error.code === 'PGRST116') {
				// No settings found, return null
				return null
			}
			// throw error
		}

		return data
	} catch (error) {
		console.error('Error fetching user settings:', error)
		throw error
	}
}
