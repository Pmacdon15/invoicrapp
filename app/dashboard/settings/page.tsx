import { Suspense } from 'react'
import SettingsFallback from '@/components/fallbacks/settings-fallback'
import { Settings } from '@/components/Settings'
import { getUserSettings } from '@/lib/settings-service-server'

export default function SettingsPage() {
	const userSettingsPromise = getUserSettings()
	return (
		<Suspense fallback={<SettingsFallback />}>
			<Settings userSettingsPromise={userSettingsPromise} />
		</Suspense>
	)
}
