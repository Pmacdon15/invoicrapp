'use server'
import { revalidatePath } from 'next/cache'
import type { ProfileFormData } from '@/components/Profile'
import { showSuccess } from '@/hooks/use-toast'
import { createClient } from '@/integrations/supabase/server/client'

export async function saveProfileInfo(profileForm: ProfileFormData) {
	try {
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const { error } = await supabase.from('profiles').upsert(
			{
				user_id: user.id,
				full_name: profileForm.full_name,
				phone: profileForm.phone,
				updated_at: new Date().toISOString(),
			},
			{
				onConflict: 'user_id',
			},
		)

		if (error) throw new Error(`Db Error: ${error.message}`)
		revalidatePath('/dashboard/profile')
	} catch (e: unknown) {
		console.error('Error Updating Profiles', e)
		return { error: 'Db Error' }
	}
}

export async function updatePassword(passwordForm: {
	current_password: string
	new_password: string
	confirm_password: string
}) {
	try {
		const supabase = await createClient()

		const { error } = await supabase.auth.updateUser({
			password: passwordForm.new_password,
		})

		if (error) throw new Error(`Db Error: ${error.message}`)

		showSuccess('Success', 'Profile updated successfully')
	} catch (e: unknown) {
		console.error('Error Updating Profiles', e)
		return { error: 'Db Error' }
	}
}
