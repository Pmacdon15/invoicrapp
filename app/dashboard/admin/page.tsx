import { Suspense } from 'react'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { getAdminAnalytics, isAdmin } from '@/lib/admin-service-server'

export default function AdminPage() {
	const isAdminPromise = isAdmin()
	const analyticsPromise = getAdminAnalytics()
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-muted-foreground">
							Loading admin dashboard...
						</p>
					</div>
				</div>
			}
		>
			<AdminDashboard
				analyticsPromise={analyticsPromise}
				isAdminPromise={isAdminPromise}
			/>
		</Suspense>
	)
}
