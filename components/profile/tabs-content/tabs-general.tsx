
import { CheckCircle, Save, UserIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'

export default function TabGeneral({
	userCreatedAt,
	userEmail,
	profileForm,
	setProfileForm,
	saving,
	handleProfileSave,
}) {
	return (
		<TabsContent className="space-y-6" value="general">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<UserIcon className="w-5 h-5" />
						Personal Information
					</CardTitle>
					<CardDescription>
						Update your personal details and contact information
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								className="bg-muted"
								defaultValue={userEmail || ''}
								disabled
								id="email"
								type="email"
							/>
							<p className="text-xs text-muted-foreground">
								Email cannot be changed from this page
							</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="full_name">Full Name</Label>
							<Input
								defaultValue={profileForm.full_name || ''}
								id="full_name"
								onChange={(e) =>
									setProfileForm({
										...profileForm,
										full_name: e.target.value,
									})
								}
								placeholder="Enter your full name"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone">Phone Number</Label>
						<Input
							defaultValue={profileForm.phone}
							id="phone"
							onChange={(e) =>
								setProfileForm({
									...profileForm,
									phone: e.target.value,
								})
							}
							placeholder="Enter your phone number"
						/>
					</div>

					<div className="flex justify-end">
						<Button
							className="w-full sm:w-auto"
							disabled={saving}
							onClick={handleProfileSave}
						>
							{saving ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Saving...
								</>
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Account Info */}
			<Card>
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
					<CardDescription>
						View your account details and status
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label className="text-sm font-medium">
								Account Created
							</Label>
							<p className="text-sm text-muted-foreground">
								{userCreatedAt
									? new Date(
											userCreatedAt,
										).toLocaleDateString()
									: 'N/A'}
							</p>
						</div>
						<div>
							<Label className="text-sm font-medium">
								Account Status
							</Label>
							<div className="flex items-center gap-2 mt-1">
								<Badge
									className="bg-green-100 text-green-800"
									variant="secondary"
								>
									<CheckCircle className="w-3 h-3 mr-1" />
									Active
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	)
}
