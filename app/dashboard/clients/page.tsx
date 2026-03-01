import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ClientManagement } from '@/components/ClientManagement'
import ClientManagementFallback from '@/components/fallbacks/client-mnagement-fallback'
import {
	getInvoiceCountsForClients,
	getUserClients,
} from '@/lib/client-service-server'

export const metadata: Metadata = {
	title: 'Clients',
	description:
		'Manage your client database with Invoicr. Store client information and streamline your invoicing process.',
	robots: {
		index: false,
		follow: false,
	},
}

export default function ClientsPage() {
	const clientsPromise = getUserClients()

	const clientsInvoiceCountPromise = clientsPromise.then((clients) => {
		const clientNames = clients?.map((client) => client.name) || []
		return getInvoiceCountsForClients(clientNames)
	})

	return (
		<Suspense fallback={<ClientManagementFallback />}>
			<ClientManagement
				clientsInvoiceCountPromise={clientsInvoiceCountPromise}
				clientsPromise={clientsPromise}
			/>
		</Suspense>
	)
}
