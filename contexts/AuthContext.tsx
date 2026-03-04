'use client'

import type { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { createContext, useEffect, useState } from 'react'
import { createClient } from '@/integrations/supabase/client'

// import { supabase } from '@/integrations/supabase/old/client'

interface AuthContextType {
	user: User | null
	session: Session | null
	loading: boolean
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	session: null,
	loading: true,
	signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const supabase = createClient()
	useEffect(() => {
		// Get initial session
		const getInitialSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			setSession(session)
			setUser(session?.user ?? null)
			setLoading(false)
		}

		getInitialSession()

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session)
			setUser(session?.user ?? null)
			setLoading(false)

			// Handle auth events - only redirect on sign out
			if (event === 'SIGNED_OUT') {
				router.replace('/')
			}
			// Don't auto-redirect on SIGNED_IN - let components handle their own redirects
		})

		return () => subscription.unsubscribe()
	}, [router,supabase ])

	const signOut = async () => {
		await supabase.auth.signOut()
	}

	const value = {
		user,
		session,
		loading,
		signOut,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
