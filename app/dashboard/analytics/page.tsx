import { Suspense } from 'react'
import { Analytics } from '@/components/Analytics'
import AnalyticsFallback from '@/components/fallbacks/analytics-fallback'
import { getInvoiceAnalytics } from '@/lib/invoice-service-server'

export default function AnalyticsPage(
	props: PageProps<'/dashboard/analytics'>,
) {
	const periodPromise = props.searchParams.then((params) => {
		const period = Array.isArray(params.period)
			? params.period[0]
			: params.period

		return period === '6months'
			? '6months'
			: period === '1year'
				? '1year'
				: '30days'
	})
	const analyticsPromise = periodPromise.then((period) =>
		getInvoiceAnalytics(period),
	)

	return (
		<Suspense fallback={<AnalyticsFallback />}>
			<Analytics
				analyticsPromise={analyticsPromise}
				periodPromise={periodPromise}
			/>
		</Suspense>
	)
}
