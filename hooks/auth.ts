'use client'

import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { createClient } from '@/integrations/supabase/client/client'

// Instantiate outside to prevent recreation on every render
const supabase = createClient()

export const useAuth = () => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getSession = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser()
				setUser(user)
			} catch (error) {
				console.error('Error fetching user:', error)
			} finally {
				// Correctly set loading to false after the promise resolves
				setLoading(false)
			}
		}

		getSession()

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
			setLoading(false)
		})

		return () => subscription.unsubscribe()
	}, [])

	const signOut = async () => {
		await supabase.auth.signOut()
	}

	return { user, signOut, loading }
}
