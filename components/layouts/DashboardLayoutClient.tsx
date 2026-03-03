'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardSidebar } from '@/components/DashboardSidebar'

export default function DashboardLayoutClient({
	children,
}: {
	children: React.ReactNode
}) {
		const pathname = usePathname()
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	const getActiveTab = () => {
		if (pathname === '/dashboard' || pathname === '/dashboard/')
			return 'invoices'
		const segments = pathname.split('/')
		return segments[2] || 'invoices' // /dashboard/[tab]
	}

	const activeTab = getActiveTab()

	return (
		<div className="h-[100dvh] bg-gray-50 flex flex-col">
			<DashboardHeader
				onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
			/>

			<div className="flex-1 flex h-[90dvh] lg:min-h-0">
				<DashboardSidebar
					activeTab={activeTab}
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(!isSidebarOpen)}
					// onTabChange={(tab) => router.push(`/dashboard/${tab}`)}
				/>

				<main className="flex-1 p-4 pb-safe lg:pb-4 overflow-y-auto bg-primary/5 lg:ml-0 h-full">
					<div className="max-w-7xl xl:max-w-full xl:px-4 mx-auto h-full">
						{children}
					</div>
				</main>
			</div>
		</div>
	)
}
