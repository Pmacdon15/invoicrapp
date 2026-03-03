'use client'
import { RefreshCw, Save, SettingsIcon } from 'lucide-react'
import { useState } from 'react'
import { saveUserSettings } from '@/actions/settings'
import { Button } from '@/components/ui/button'
import { showError, showSuccess } from '@/hooks/use-toast'
import type { SettingsFormData } from '@/types/settings'

export default function SettingsHeader({
	settingsToUpdate,
}: {
	settingsToUpdate?: SettingsFormData
}) {
	const [saving, setSaving] = useState(false)
	const validateRequiredFields = () => {
		const requiredFields = {
			company_name: settingsToUpdate.company_name?.trim(),
			company_email: settingsToUpdate.company_email?.trim(),
			company_address: settingsToUpdate.company_address?.trim(),
		}

		const missingFields = []
		if (!requiredFields.company_name) missingFields.push('Company Name')
		if (!requiredFields.company_email) missingFields.push('Company Email')
		if (!requiredFields.company_address) missingFields.push('Address')

		// Validate email format if provided
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (
			requiredFields.company_email &&
			!emailRegex.test(requiredFields.company_email)
		) {
			return { isValid: false, missingFields: ['Valid Company Email'] }
		}

		return { isValid: missingFields.length === 0, missingFields }
	}
	const handleSave = async () => {
		// Validate required fields
		const validation = validateRequiredFields()
		if (!validation.isValid) {
			showError(
				'Required fields missing',
				`Please fill in the following required fields: ${validation.missingFields.join(
					', ',
				)}`,
			)
			return
		}

		setSaving(true)
		try {
			await saveUserSettings(settingsToUpdate)
			showSuccess(
				'Settings saved',
				'Your settings have been updated successfully.',
			)
		} catch (error) {
			console.error('Error saving settings:', error)
			showError(
				'Error saving settings',
				'Failed to save your settings. Please try again.',
			)
		} finally {
			setSaving(false)
		}
	}
	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
					<SettingsIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
					Settings
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					Manage your account and invoice preferences
				</p>
			</div>
			<Button
				className="gap-2 w-full sm:w-auto"
				disabled={saving|| !settingsToUpdate}
				onClick={handleSave}
			>
				{saving ? (
					<RefreshCw className="h-4 w-4 animate-spin" />
				) : (
					<Save className="h-4 w-4" />
				)}
				{saving ? 'Saving...' : 'Save Changes'}
			</Button>
		</div>
	)
}
