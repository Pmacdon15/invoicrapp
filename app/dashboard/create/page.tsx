import { Suspense } from 'react'
import InvoiceGeneratorFallback from '@/components/fallbacks/create-invoice-fallback'
import { InvoiceGenerator } from '@/components/InvoiceGenerator'
import { createClient } from '@/integrations/supabase/server/client'
import { getUserClients } from '@/lib/client-service-server'
import { getInvoiceById } from '@/lib/invoice-service-server'
import { getDefaultTheme, getThemeById } from '@/lib/invoice-themes'
import { SettingsService } from '@/lib/settings-service'
import { checkUserSettingsConfigured } from '@/lib/settings-validation'

export default async function CreateInvoicePage(
	props: PageProps<'/dashboard/create'>,
) {
	const invoicePromise = props.searchParams.then(({ editId, viewId }) => {
		const targetId = [editId, viewId].flat().filter(Boolean)[0]
		console.log(targetId)
		return getInvoiceById(targetId)
	})

	const supabaseServerPromise = createClient()
	const userPromise = supabaseServerPromise.then((s) => s.auth.getUser())

	const clientsPromise = getUserClients()

	const settingsValidationPromise = userPromise.then(async (data) => {
		if (!data.data.user?.id) return

		return checkUserSettingsConfigured(data.data.user?.id)
	})

	const settingsUserPromise = userPromise.then(async (data) => {
		if (!data.data.user?.id) return

		return SettingsService.getSettingsWithDefaults(data.data.user?.id)
	})

	const defaultThemePromise = settingsUserPromise.then(async (data) => {
		if (!data?.default_theme || data.default_theme === undefined) {
			return getDefaultTheme()
		}
		return getThemeById(data.default_theme)
	})

	return (
		<Suspense fallback={<InvoiceGeneratorFallback />}>
			<InvoiceGenerator
				clientsPromise={clientsPromise}
				defaultThemePromise={defaultThemePromise}
				editingInvoicePromise={invoicePromise}
				settingsUserPromise={settingsUserPromise}
				settingsValidationPromise={settingsValidationPromise}
			/>
		</Suspense>
	)
}
