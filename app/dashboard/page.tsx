import { redirect } from 'next/navigation'

export default async function DashboardPage() {
	redirect('/dashboard/invoices')
	return <div>Redirecting</div>
}
