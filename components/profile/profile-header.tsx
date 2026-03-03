import { UserIcon } from 'lucide-react'

export default function ProfileHeader() {
	return (
		<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 sm:mb-8">
			<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
				<UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
			</div>
			<div className="text-center sm:text-left">
				<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
					Profile Settings
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					Manage your account information and preferences
				</p>
			</div>
		</div>
	)
}
