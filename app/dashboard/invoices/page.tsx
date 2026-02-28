import { Suspense } from 'react'
import InvoicesFallback from '@/components/fallbacks/invoice-fallback'
import InvoiceHistory from '@/components/InvoiceHistory'
import { getUserInvoices } from '@/lib/invoice-service-server'

export default function InvoicesPage() {
	const invoicesPromise = getUserInvoices()
	return (
		<Suspense fallback={<InvoicesFallback />}>
			<InvoiceHistory invoicesPromise={invoicesPromise} />
		</Suspense>
	)
}
