import { RefreshCw } from 'lucide-react'
import SettingsHeader from '../settings/settings-header'
import SettingsTabsList from '../settings/settings-tabs-list'
import { Tabs } from '../ui/tabs'

export default function SettingsFallback() {
	return (
		<div className="space-y-6">
			<SettingsHeader />
			<Tabs className="space-y-6" defaultValue="company">
				<SettingsTabsList />
			</Tabs>
			<div className="flex items-center justify-center h-64">
				<RefreshCw className="h-8 w-8 animate-spin text-primary" />
				<span className="ml-2 text-muted-foreground">
					Loading settings...
				</span>
			</div>
		</div>
	)
}
