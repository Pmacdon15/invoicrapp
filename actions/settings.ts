'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/integrations/supabase/server/client'
import type { SettingsFormData, UserSettings } from '@/types/settings'

export async function saveUserSettings(
	settings: Partial<SettingsFormData>,
): Promise<UserSettings> {
	const supabase = await createClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()
	if (authError || !user) {
		throw new Error('Unauthorized')
	}

	try {
		// Check if settings already exist for this user
		const { data: existingSettings } = await supabase
			.from('user_settings')
			.select('id')
			.eq('user_id', user.id)
			.maybeSingle()

		let result: any

		if (existingSettings) {
			// Update existing settings
			result = await supabase
				.from('user_settings')
				.update({
					...settings,
					updated_at: new Date().toISOString(),
				})
				.eq('user_id', user.id)
				.select()
				.single()
		} else {
			// Create new settings
			result = await supabase
				.from('user_settings')
				.insert({
					user_id: user.id,
					...settings,
					updated_at: new Date().toISOString(),
				})
				.select()
				.single()
		}

		if (result.error) throw result.error
		revalidatePath('/dashboard/settings')
		return result.data
	} catch (error) {
		console.error('Error saving user settings:', error)
		throw error
	}
}

export async function uploadCompanyLogo(file: File) {
	if (!file || !(file instanceof File)) throw new Error('Invalid file')

	try {
		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

		// Just pass the new data to the core function
		await saveUserSettings({ company_logo: base64 })

		return base64
	} catch (error) {
		console.error('Logo upload error:', error)
		throw error
	}
}

export async function resetInvoiceCounter(
	newCounter: number = 1,
): Promise<void> {
	//TODO: make sure rsl stops users from changing this setting them selfs
	await saveUserSettings({ invoice_counter: newCounter })
}
