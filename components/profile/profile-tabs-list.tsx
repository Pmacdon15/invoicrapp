import { Bell, Shield, UserIcon } from 'lucide-react'
import { TabsList, TabsTrigger } from '../ui/tabs'

export default function ProfileTabsList() {
	return (
		<div className="w-full overflow-x-auto">
			<TabsList className="flex w-max min-w-full justify-between sm:grid sm:grid-cols-3 gap-1 p-1">
				<TabsTrigger
					className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm font-medium"
					value="general"
				>
					<UserIcon className="w-4 h-4 mr-1" />
					General
				</TabsTrigger>
				<TabsTrigger
					className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm font-medium"
					value="security"
				>
					<Shield className="w-4 h-4 mr-1" />
					Security
				</TabsTrigger>
				<TabsTrigger
					className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm font-medium"
					value="notifications"
				>
					<Bell className="w-4 h-4 mr-1" />
					Notifications
				</TabsTrigger>
			</TabsList>
		</div>
	)
}
