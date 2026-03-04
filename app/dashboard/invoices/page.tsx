import { Suspense } from 'react'
import InvoicesFallback from '@/components/fallbacks/invoice-fallback'
import InvoiceHistory from '@/components/InvoiceHistory'
import { getUserInvoices } from '@/lib/invoice-service-server'
import { getUserSettings } from '@/lib/settings-service-server'

export const dynamic = 'force-dynamic'

export default function InvoicesPage(props: PageProps<'/dashboard/invoices'>) {
	const searchTermPromise = props.searchParams.then((params) => {
		return Array.isArray(params.search)
			? params.search[0]
			: (params.search ?? '')
	})

	const invoicesPromise = searchTermPromise.then((search) => {
		return getUserInvoices(search)
	})
	
	const userSettingsPromise = getUserSettings()

	const filterPromise = props.searchParams.then((params) => {
		const f = params.filter
		return f === 'all' ||
			f === 'draft' ||
			f === 'sent' ||
			f === 'paid' ||
			f === 'overdue' ||
			f === 'cancelled'
			? f
			: 'all'
	})

	const sortPromise = props.searchParams.then((params) => {
		const s = params.status
		return s === 'invoice_number' ||
			s === 'client_name' ||
			s === 'invoice_date' ||
			s === 'status'
			? s
			: 'invoice_number'
	})

	const orderPromise = props.searchParams.then((params) => {
		const o = params.order
		return o === 'asc' || o === 'desc' ? o : 'asc'
	})

	return (
		<Suspense fallback={<InvoicesFallback />}>
			<InvoiceHistory
				filterPromise={filterPromise}
				invoicesPromise={invoicesPromise}
				orderPromise={orderPromise}
				searchTermPromise={searchTermPromise}
				sortPromise={sortPromise}
				userSettingsPromise={userSettingsPromise}
			/>
		</Suspense>
	)
}
