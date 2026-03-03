import { Bell, Building2, CreditCard, Globe, Hash, Plus } from 'lucide-react'
import { TabsList, TabsTrigger } from '../ui/tabs'

export default function SettingsTabsList() {
	return (
		<div className="w-full overflow-x-auto">
			<TabsList className="flex w-max min-w-full justify-start sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-1 p-1">
				<TabsTrigger
					className="flex-shrink-0 px-3 py-2 text-xs font-medium"
					value="company"
				>
					<Building2 className="h-4 w-4 mr-1" />
					Company
				</TabsTrigger>
				<TabsTrigger
					className="flex-shrink-0 px-3 py-2 text-xs font-medium"
					value="invoices"
				>
					<CreditCard className="h-4 w-4 mr-1" />
					Invoices
				</TabsTrigger>
				<TabsTrigger
					className="flex-shrink-0 px-3 py-2 text-xs font-medium"
					value="notifications"
				>
					<Bell className="h-4 w-4 mr-1" />
					Notifications
				</TabsTrigger>
				<TabsTrigger
					className="flex-shrink-0 px-3 py-2 text-xs font-medium"
					value="preferences"
				>
					<Globe className="h-4 w-4 mr-1" />
					Preferences
				</TabsTrigger>
				<TabsTrigger
					className="flex-shrink-0 px-3 py-2 text-xs font-medium"
					value="numbering"
				>
					<Hash className="h-4 w-4 mr-1" />
					Numbering
				</TabsTrigger>
				<TabsTrigger
					className="flex-shrink-0 px-3 py-2 text-xs font-medium"
					value="custom-fields"
				>
					<Plus className="h-4 w-4 mr-1" />
					Custom Fields
				</TabsTrigger>
			</TabsList>
		</div>
	)
}
