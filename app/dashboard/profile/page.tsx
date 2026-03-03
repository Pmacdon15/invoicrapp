import { Suspense } from 'react'
import { Profile } from '@/components/Profile'
import {
	getUser,
	getUserProfile,
	getUserSettings,
} from '@/lib/settings-service-server'

export default function ProfilePage() {
	const userPromise = getUser()
	const userSettingsPromise = getUserSettings()
	const userProfilePromise = getUserProfile()
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			}
		>
			<Profile
				userProfilePromise={userProfilePromise}
				userPromise={userPromise}
				userSettingsPromise={userSettingsPromise}
			/>
		</Suspense>
	)
}
