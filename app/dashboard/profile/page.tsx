import { Suspense } from 'react'
import ProfileFallback from '@/components/fallbacks/profile_fallback'
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
		<Suspense fallback={<ProfileFallback />}>
			<Profile
				userProfilePromise={userProfilePromise}
				userPromise={userPromise}
				userSettingsPromise={userSettingsPromise}
			/>
		</Suspense>
	)
}
