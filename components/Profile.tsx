'use client'

import type { User } from '@supabase/supabase-js'
import {
	AlertTriangle,
	Bell,
	CheckCircle,
	Eye,
	EyeOff,
	Key,
	Save,
	Shield,
	Trash2,
} from 'lucide-react'
import { use, useState } from 'react'
import { saveUserSettings } from '@/actions/settings'
import { saveProfileInfo, updatePassword } from '@/actions/users'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { showError, showSuccess } from '@/hooks/use-toast'
import { createClient } from '@/integrations/supabase/client'
import type { UserSettings } from '@/types/settings'
import ProfileHeader from './profile/profile-header'
import ProfileTabsList from './profile/profile-tabs-list'
import TabGeneral from './profile/tabs-content/tabs-general'

export interface UserProfile {
	id: string
	user_id: string
	email?: string
	full_name: string | null
	company_name: string | null
	avatar_url?: string | null
	phone?: string | null
	bio?: string | null
	created_at: string
	updated_at: string
}

export interface ProfileFormData {
	full_name: string
	phone: string
}

interface NotificationSettings {
	email_notifications: boolean
	marketing_emails: boolean
}

export const Profile = ({
	userPromise,
	userSettingsPromise,
	userProfilePromise,
}: {
	userPromise: Promise<User>
	userSettingsPromise: Promise<UserSettings>
	userProfilePromise: Promise<UserProfile>
}) => {
	const user = use(userPromise)
	const userSettings = use(userSettingsPromise)
	const userProfile = use(userProfilePromise)

	// const router = useRouter()

	const [saving, setSaving] = useState(false)

	const isSocialLogin =
		user.app_metadata?.providers?.some(
			(provider: string) => provider !== 'email',
		) || false

	const [profileForm, setProfileForm] = useState<ProfileFormData>({
		full_name: userProfile.full_name ?? '',
		phone: userProfile.phone ?? '',
	})
	const [notificationSettings, setNotificationSettings] =
		useState<NotificationSettings>({
			email_notifications: userSettings.email_notifications ?? true,
			marketing_emails: userSettings.marketing_emails ?? false,
		})
	const [passwordForm, setPasswordForm] = useState({
		current_password: '',
		new_password: '',
		confirm_password: '',
	})
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	})

	const handleProfileSave = async () => {
		setSaving(true)
		try {
			const error = await saveProfileInfo(profileForm)
			if (error) throw new Error(error.error)
			else showSuccess('Success', 'Profile updated')
		} catch (error) {
			console.error('Error saving profile:', error)
			showError('Error', 'Failed to update profile')
		} finally {
			setSaving(false)
		}
	}

	const handleNotificationSave = async () => {
		setSaving(true)
		try {
			await saveUserSettings({
				email_notifications: notificationSettings.email_notifications,
				marketing_emails: notificationSettings.marketing_emails,
			})

			showSuccess(
				'Success',
				'Notification preferences updated successfully',
			)
		} catch (error) {
			console.error('Error saving notification settings:', error)
			showError('Error', 'Failed to update notification preferences')
		} finally {
			setSaving(false)
		}
	}

	const handlePasswordChange = async () => {
		if (passwordForm.new_password !== passwordForm.confirm_password) {
			showError('Error', "New passwords don't match")
			return
		}

		if (passwordForm.new_password.length < 6) {
			showError('Error', 'Password must be at least 6 characters')
			return
		}

		setSaving(true)
		try {
			await updatePassword(passwordForm)

			setPasswordForm({
				current_password: '',
				new_password: '',
				confirm_password: '',
			})

			showSuccess('Success', 'Password updated successfully')
		} catch (error) {
			console.error('Error updating password:', error)
			showError('Error', 'Failed to update password')
		} finally {
			setSaving(false)
		}
	}

	const handleDeleteAccount = () => {
		try {
			const supabase = createClient()
			supabase.auth.signOut()

			showSuccess(
				'Account Deleted',
				'Your account has been deleted successfully',
			)
		} catch (error) {
			console.error('Error deleting account:', error)
			showError('Error', 'Failed to delete account')
		}
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6 h-full mb-2 ">
			<ProfileHeader />

			<Tabs className="space-y-6 mb-2" defaultValue="general">
				<ProfileTabsList />

				{/* General Tab */}
				<TabGeneral
					handleProfileSave={handleProfileSave}
					profileForm={profileForm}
					saving={saving}
					setProfileForm={setProfileForm}
					userCreatedAt={user.created_at}
					userEmail={user.email}
				/>

				{/* Security Tab */}
				<TabsContent className="space-y-6" value="security">
					{!isSocialLogin && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Key className="w-5 h-5" />
									Change Password
								</CardTitle>
								<CardDescription>
									Update your password to keep your account
									secure
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="current_password">
										Current Password
									</Label>
									<div className="relative">
										<Input
											id="current_password"
											onChange={(e) =>
												setPasswordForm({
													...passwordForm,
													current_password:
														e.target.value,
												})
											}
											placeholder="Enter current password"
											type={
												showPasswords.current
													? 'text'
													: 'password'
											}
											value={
												passwordForm.current_password
											}
										/>
										<Button
											className="absolute right-0 top-0 h-full px-3"
											onClick={() =>
												setShowPasswords({
													...showPasswords,
													current:
														!showPasswords.current,
												})
											}
											size="sm"
											type="button"
											variant="ghost"
										>
											{showPasswords.current ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
											)}
										</Button>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="new_password">
											New Password
										</Label>
										<div className="relative">
											<Input
												id="new_password"
												onChange={(e) =>
													setPasswordForm({
														...passwordForm,
														new_password:
															e.target.value,
													})
												}
												placeholder="Enter new password"
												type={
													showPasswords.new
														? 'text'
														: 'password'
												}
												value={
													passwordForm.new_password
												}
											/>
											<Button
												className="absolute right-0 top-0 h-full px-3"
												onClick={() =>
													setShowPasswords({
														...showPasswords,
														new: !showPasswords.new,
													})
												}
												size="sm"
												type="button"
												variant="ghost"
											>
												{showPasswords.new ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</Button>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="confirm_password">
											Confirm New Password
										</Label>
										<div className="relative">
											<Input
												id="confirm_password"
												onChange={(e) =>
													setPasswordForm({
														...passwordForm,
														confirm_password:
															e.target.value,
													})
												}
												placeholder="Confirm new password"
												type={
													showPasswords.confirm
														? 'text'
														: 'password'
												}
												value={
													passwordForm.confirm_password
												}
											/>
											<Button
												className="absolute right-0 top-0 h-full px-3"
												onClick={() =>
													setShowPasswords({
														...showPasswords,
														confirm:
															!showPasswords.confirm,
													})
												}
												size="sm"
												type="button"
												variant="ghost"
											>
												{showPasswords.confirm ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</Button>
										</div>
									</div>
								</div>

								<div className="flex justify-end">
									<Button
										className="w-full sm:w-auto"
										disabled={saving}
										onClick={handlePasswordChange}
									>
										{saving ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Updating...
											</>
										) : (
											<>
												<Key className="w-4 h-4 mr-2" />
												Update Password
											</>
										)}
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{isSocialLogin && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Shield className="w-5 h-5" />
									Social Login Account
								</CardTitle>
								<CardDescription>
									Your account is connected via social login
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
									<CheckCircle className="w-5 h-5 text-green-600" />
									<div>
										<p className="font-medium">
											Password management is handled by
											your social provider
										</p>
										<p className="text-sm text-muted-foreground">
											To change your password, please
											visit your social provider's
											settings
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Danger Zone */}
					<Card className="border-destructive/50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-destructive">
								<AlertTriangle className="w-5 h-5" />
								Danger Zone
							</CardTitle>
							<CardDescription>
								Irreversible and destructive actions
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg">
								<div>
									<h4 className="font-medium">
										Delete Account
									</h4>
									<p className="text-sm text-muted-foreground">
										Permanently delete your account and all
										associated data
									</p>
								</div>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											className="w-full sm:w-auto"
											size="sm"
											variant="destructive"
										>
											<Trash2 className="w-4 h-4 mr-2" />
											Delete Account
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
												This will permanently delete
												your account and remove all your
												data from our servers.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
												onClick={handleDeleteAccount}
											>
												Delete Account
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Notifications Tab */}
				<TabsContent className="space-y-6" value="notifications">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Bell className="w-5 h-5" />
								Notification Preferences
							</CardTitle>
							<CardDescription>
								Choose what notifications you want to receive
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label className="text-base">
											Email Notifications
										</Label>
										<p className="text-sm text-muted-foreground">
											Receive email notifications for
											important updates
										</p>
									</div>
									<Switch
										checked={
											notificationSettings.email_notifications
										}
										onCheckedChange={(checked) =>
											setNotificationSettings({
												...notificationSettings,
												email_notifications: checked,
											})
										}
									/>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label className="text-base">
											Marketing Emails
										</Label>
										<p className="text-sm text-muted-foreground">
											Receive emails about new features
											and promotions
										</p>
									</div>
									<Switch
										checked={
											notificationSettings.marketing_emails
										}
										onCheckedChange={(checked) =>
											setNotificationSettings({
												...notificationSettings,
												marketing_emails: checked,
											})
										}
									/>
								</div>
							</div>

							<div className="flex justify-end">
								<Button
									className="w-full sm:w-auto"
									disabled={saving}
									onClick={handleNotificationSave}
								>
									{saving ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Saving...
										</>
									) : (
										<>
											<Save className="w-4 h-4 mr-2" />
											Save Preferences
										</>
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
