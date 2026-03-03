'use client'

import ProfileHeader from '../profile/profile-header'
import ProfileTabsList from '../profile/profile-tabs-list'
import TabGeneral from '../profile/tabs-content/tabs-general'
import { Tabs } from '../ui/tabs'

export default function ProfileFallback() {
	return (
		<div className="max-w-4xl mx-auto space-y-6 h-full ">
			<ProfileHeader />

			<Tabs className="space-y-6 mb-2" defaultValue="general">
				<ProfileTabsList />

				{/* General Tab */}
				<TabGeneral
					handleProfileSave={() => {}}
					profileForm={{}}
					saving={false}
					setProfileForm={() => {}}
					userCreatedAt={''}
					userEmail={''}
				/>
			</Tabs>
			<div className="flex items-center justify-center gap-2">
				<p>Loading</p>
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		</div>
	)
}
