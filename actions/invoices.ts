'use server'

import { createClient } from '@/integrations/supabase/server/client'
import type { CreateInvoiceData, SavedInvoice } from '@/lib/invoice-service'
import { SubscriptionService } from '@/lib/subscription-service'

// Save a new invoice with usage tracking
export const saveInvoice = async (
	invoiceData: CreateInvoiceData,
): Promise<{ success: boolean; invoice?: SavedInvoice; error?: string }> => {
	try {
		const supabaseServer = await createClient()
		const {
			data: { user },
		} = await supabaseServer.auth.getUser()

		if (!user) return { success: false, error: 'User not authenticated' }

		const usageIncremented =
			await SubscriptionService.incrementInvoiceUsage(user.id)
		if (!usageIncremented) {
			return { success: false, error: 'Failed to update usage tracking.' }
		}

		const { data: invoice, error: invoiceError } = await supabaseServer
			.from('invoices')
			.insert({
				user_id: user.id,
				...invoiceData,
			})
			.select()
			.single()

		if (invoiceError) throw invoiceError

		const { data: currentSettings } = await supabaseServer
			.from('user_settings')
			.select('invoice_counter')
			.eq('user_id', user.id)
			.single()

		await supabaseServer
			.from('user_settings')
			.update({
				invoice_counter: (currentSettings?.invoice_counter || 0) + 1,
			})
			.eq('user_id', user.id)

		return { success: true, invoice: invoice as SavedInvoice }
	} catch (error) {
		console.error('Error in saveInvoice flow:', error)
		return { success: false, error: 'An unexpected error occurred.' }
	}
}
