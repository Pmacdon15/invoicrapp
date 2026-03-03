'use client'

import {
	AlertTriangle,
	Bell,
	Building,
	Building2,
	Calendar,
	Clock,
	CreditCard,
	DollarSign,
	ExternalLink,
	FileText,
	Globe,
	Hash,
	Image,
	Mail,
	MapPin,
	Palette,
	Phone,
	Plus,
	RefreshCw,
	Settings as SettingsIcon,
	Trash2,
	Type,
	Zap,
} from 'lucide-react'
import { use, useState } from 'react'
import { resetInvoiceCounter, uploadCompanyLogo } from '@/actions/settings'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { showError, showSuccess } from '@/hooks/use-toast'
import { getThemes } from '@/lib/invoice-themes'
import type {
	CustomField,
	SettingsFormData,
	UserSettings,
} from '@/types/settings'
import {
	CURRENCY_OPTIONS,
	DATE_FORMAT_OPTIONS,
	DEFAULT_SETTINGS,
	PAYMENT_TERMS_OPTIONS,
	TIMEZONE_OPTIONS,
} from '@/types/settings'
import SettingsHeader from './settings/settings-header'
import SettingsTabsList from './settings/settings-tabs-list'

export const Settings = ({
	userSettingsPromise,
}: {
	userSettingsPromise: Promise<UserSettings>
}) => {
	const settings = use(userSettingsPromise)
	const [settingsToUpdate, setSettingsToUpdate] = useState<SettingsFormData>({
		...DEFAULT_SETTINGS,
		...settings,
	})

	const handleLogoUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0]
		if (!file) return

		// Validate file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			showError(
				'File too large',
				'Please select an image smaller than 2MB.',
			)
			return
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			showError('Invalid file type', 'Please select an image file.')
			return
		}

		try {
			await uploadCompanyLogo(file)

			showSuccess('Logo uploaded', 'Your company logo has been updated.')
		} catch (error) {
			console.error('Error uploading logo:', error)
			showError(
				'Upload failed',
				'Failed to upload logo. Please try again.',
			)
		}
	}

	const handleResetCounter = async () => {
		try {
			await resetInvoiceCounter()
			setSettingsToUpdate((prev) => ({ ...prev, invoice_counter: 1 }))
			showSuccess('Counter reset', 'Invoice counter has been reset to 1.')
		} catch (error) {
			console.error('Error resetting counter:', error)
			showError('Reset failed', 'Failed to reset invoice counter.')
		}
	}

	// Custom Fields Management
	const addCustomField = () => {
		const newField: CustomField = {
			id: `field_${Date.now()}`,
			label: '',
			type: 'text',
			required: false,
			defaultValue: '',
		}
		setSettingsToUpdate((prev) => ({
			...prev,
			custom_fields: [...(prev.custom_fields || []), newField],
		}))
	}

	const updateCustomField = (
		fieldId: string,
		updates: Partial<CustomField>,
	) => {
		setSettingsToUpdate((prev) => ({
			...prev,
			custom_fields: (prev.custom_fields || []).map((field) =>
				field.id === fieldId ? { ...field, ...updates } : field,
			),
		}))
	}

	const removeCustomField = (fieldId: string) => {
		setSettingsToUpdate((prev) => ({
			...prev,
			custom_fields: (prev.custom_fields || []).filter(
				(field) => field.id !== fieldId,
			),
		}))
	}

	const getFieldIcon = (type: string) => {
		switch (type) {
			case 'text':
				return <Type className="h-4 w-4" />
			case 'number':
				return <Hash className="h-4 w-4" />
			case 'date':
				return <Calendar className="h-4 w-4" />
			default:
				return <Type className="h-4 w-4" />
		}
	}

	return (
		<div className="space-y-6">
			<SettingsHeader settingsToUpdate={settingsToUpdate} />

			<Tabs className="space-y-6" defaultValue="company">
				<SettingsTabsList />

				{/* Company Information */}
				<TabsContent className="space-y-6" value="company">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Building2 className="h-5 w-5" />
								Company Information
							</CardTitle>
							<CardDescription>
								Update your business details that will appear on
								invoices. Fields marked with{' '}
								<span className="text-red-500">*</span> are
								required.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<Image className="h-4 w-4" />
										Company Logo
									</Label>
									<div className="flex items-center gap-4">
										{settings.company_logo && (
											<div className="w-16 h-16 border rounded-lg overflow-hidden bg-muted">
												<img
													alt="Company Logo"
													className="w-full h-full object-contain"
													src={settings.company_logo}
												/>
											</div>
										)}
										<div className="flex-1">
											<Input
												accept="image/*"
												className="cursor-pointer"
												onChange={handleLogoUpload}
												type="file"
											/>
											<p className="text-xs text-muted-foreground mt-1">
												Recommended: 200x200px, max 2MB
												(PNG, JPG, SVG)
											</p>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="company_name"
									>
										<Building className="h-4 w-4" />
										Company Name{' '}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										className={
											!settings.company_name?.trim()
												? 'border-red-300 focus:border-red-500'
												: ''
										}
										defaultValue={settings.company_name}
										id="company_name"
										onChange={(e) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												company_name: e.target.value,
											}))
										}
										placeholder="Your Company Name"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="company_email"
									>
										<Mail className="h-4 w-4" />
										Company Email{' '}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										className={
											!settings.company_email?.trim()
												? 'border-red-300 focus:border-red-500'
												: ''
										}
										defaultValue={settings.company_email}
										id="company_email"
										onChange={(e) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												company_email: e.target.value,
											}))
										}
										placeholder="contact@company.com"
										required
										type="email"
									/>
								</div>
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="company_phone"
									>
										<Phone className="h-4 w-4" />
										Phone Number
									</Label>
									<Input
										defaultValue={settings.company_phone}
										id="company_phone"
										onChange={(e) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												company_phone: e.target.value,
											}))
										}
										placeholder="+1 (555) 123-4567"
									/>
								</div>
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="company_website"
									>
										<ExternalLink className="h-4 w-4" />
										Website
									</Label>
									<Input
										defaultValue={settings.company_website}
										id="company_website"
										onChange={(e) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												company_website: e.target.value,
											}))
										}
										placeholder="https://www.company.com"
									/>
								</div>

								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="company_address"
									>
										<MapPin className="h-4 w-4" />
										Address{' '}
										<span className="text-red-500">*</span>
									</Label>
									<Textarea
										className={
											!settings.company_address?.trim()
												? 'border-red-300 focus:border-red-500'
												: ''
										}
										defaultValue={settings.company_address}
										id="company_address"
										onChange={(e) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												company_address: e.target.value,
											}))
										}
										placeholder="123 Business St, City, State 12345"
										required
										rows={3}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Invoice Defaults */}
				<TabsContent className="space-y-6" value="invoices">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="h-5 w-5" />
								Invoice Defaults
							</CardTitle>
							<CardDescription>
								Set default values for new invoices
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="default_theme"
									>
										<Palette className="h-4 w-4" />
										Default Theme
									</Label>
									<Select
										defaultValue={settings.default_theme}
										onValueChange={(value) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												default_theme: value,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{getThemes().map((theme) => (
												<SelectItem
													key={theme.id}
													value={theme.id}
												>
													{theme.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="default_currency"
									>
										<DollarSign className="h-4 w-4" />
										Default Currency
									</Label>
									<Select
										defaultValue={settings.default_currency}
										onValueChange={(value) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												default_currency: value,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{CURRENCY_OPTIONS.map((option) => (
												<SelectItem
													key={option.value}
													value={option.value}
												>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="default_tax_rate"
									>
										<Zap className="h-4 w-4" />
										Default Tax Rate (%)
									</Label>
									<Input
										defaultValue={settings.default_tax_rate}
										id="default_tax_rate"
										max="100"
										min="0"
										onChange={(e) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												default_tax_rate:
													parseFloat(
														e.target.value,
													) || 0,
											}))
										}
										placeholder="0.00"
										step="0.01"
										type="number"
									/>
								</div>
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="default_payment_terms"
									>
										<Clock className="h-4 w-4" />
										Default Payment Terms
									</Label>
									<Select
										onValueChange={(value) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												default_payment_terms: value,
											}))
										}
										value={settings.default_payment_terms}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{PAYMENT_TERMS_OPTIONS.map(
												(option) => (
													<SelectItem
														key={option.value}
														value={option.value}
													>
														{option.label}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									className="flex items-center gap-2"
									htmlFor="default_notes"
								>
									<FileText className="h-4 w-4" />
									Default Notes
								</Label>
								<Textarea
									defaultValue={settings.default_notes}
									id="default_notes"
									onChange={(e) =>
										setSettingsToUpdate((prev) => ({
											...prev,
											default_notes: e.target.value,
										}))
									}
									placeholder="Thank you for your business!"
									rows={3}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Notifications */}
				<TabsContent className="space-y-6" value="notifications">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Bell className="h-5 w-5" />
								Notification Preferences
							</CardTitle>
							<CardDescription>
								Choose what notifications you'd like to receive
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Mail className="h-4 w-4" />
										Email Notifications
									</Label>
									<p className="text-sm text-muted-foreground">
										Receive general email notifications
									</p>
								</div>
								<Switch
									defaultChecked={
										settings.email_notifications
									}
									onCheckedChange={(checked) =>
										setSettingsToUpdate((prev) => ({
											...prev,
											email_notifications: checked,
										}))
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Clock className="h-4 w-4" />
										Payment Reminders
									</Label>
									<p className="text-sm text-muted-foreground">
										Get notified about overdue invoices
									</p>
								</div>
								<Switch
									defaultChecked={settings.payment_reminders}
									onCheckedChange={(checked) =>
										setSettingsToUpdate((prev) => ({
											...prev,
											payment_reminders: checked,
										}))
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Bell className="h-4 w-4" />
										Invoice Updates
									</Label>
									<p className="text-sm text-muted-foreground">
										Notifications when invoices are viewed
										or paid
									</p>
								</div>
								<Switch
									defaultChecked={settings.invoice_updates}
									onCheckedChange={(checked) =>
										setSettingsToUpdate((prev) => ({
											...prev,
											invoice_updates: checked,
										}))
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="flex items-center gap-2">
										<Mail className="h-4 w-4" />
										Marketing Emails
									</Label>
									<p className="text-sm text-muted-foreground">
										Receive updates about new features and
										tips
									</p>
								</div>
								<Switch
									defaultChecked={settings.marketing_emails}
									onCheckedChange={(checked) =>
										setSettingsToUpdate((prev) => ({
											...prev,
											marketing_emails: checked,
										}))
									}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Preferences */}
				<TabsContent className="space-y-6" value="preferences">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Globe className="h-5 w-5" />
								Display Preferences
							</CardTitle>
							<CardDescription>
								Customize how information is displayed
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="date_format"
									>
										<Calendar className="h-4 w-4" />
										Date Format
									</Label>
									<Select
										onValueChange={(value) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												date_format: value,
											}))
										}
										value={settings.date_format}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{DATE_FORMAT_OPTIONS.map(
												(option) => (
													<SelectItem
														key={option.value}
														value={option.value}
													>
														{option.label}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="timezone"
									>
										<Globe className="h-4 w-4" />
										Timezone
									</Label>
									<Select
										onValueChange={(value) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												timezone: value,
											}))
										}
										value={settings.timezone}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{TIMEZONE_OPTIONS.map((option) => (
												<SelectItem
													key={option.value}
													value={option.value}
												>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="number_format"
									>
										<Hash className="h-4 w-4" />
										Number Format
									</Label>
									<Select
										onValueChange={(value) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												number_format: value,
											}))
										}
										value={settings.number_format}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="US">
												US (1,234.56)
											</SelectItem>
											<SelectItem value="EU">
												EU (1.234,56)
											</SelectItem>
											<SelectItem value="IN">
												IN (1,23,456.78)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="language"
									>
										<Type className="h-4 w-4" />
										Language
									</Label>
									<Select
										onValueChange={(value) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												language: value,
											}))
										}
										value={settings.language}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="en">
												English
											</SelectItem>
											<SelectItem value="es">
												Español
											</SelectItem>
											<SelectItem value="fr">
												Français
											</SelectItem>
											<SelectItem value="de">
												Deutsch
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Invoice Numbering */}
				<TabsContent className="space-y-6" value="numbering">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Hash className="h-5 w-5" />
								Invoice Numbering
							</CardTitle>
							<CardDescription>
								Configure how invoice numbers are generated
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="invoice_prefix"
									>
										<Hash className="h-4 w-4" />
										Invoice Prefix
									</Label>
									<Input
										defaultValue={settings.invoice_prefix}
										id="invoice_prefix"
										onChange={(e) =>
											setSettingsToUpdate((prev) => ({
												...prev,
												invoice_prefix: e.target.value,
											}))
										}
										placeholder="INV"
									/>
								</div>
								<div className="space-y-2">
									<Label
										className="flex items-center gap-2"
										htmlFor="invoice_counter"
									>
										<Hash className="h-4 w-4" />
										Next Invoice Number
									</Label>
									<div className="flex gap-2">
										<Input
											defaultValue={
												settings.invoice_counter
											}
											id="invoice_counter"
											min="1"
											onChange={(e) =>
												setSettingsToUpdate((prev) => ({
													...prev,
													invoice_counter:
														parseInt(
															e.target.value,
														) || 1,
												}))
											}
											type="number"
										/>
										<Button
											onClick={handleResetCounter}
											size="sm"
											variant="outline"
										>
											<RefreshCw className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									className="flex items-center gap-2"
									htmlFor="invoice_number_format"
								>
									<SettingsIcon className="h-4 w-4" />
									Number Format
								</Label>
								<Select
									onValueChange={(value) =>
										setSettingsToUpdate((prev) => ({
											...prev,
											invoice_number_format: value,
										}))
									}
									value={settings.invoice_number_format}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="{prefix}-{number}">
											INV-0001
										</SelectItem>
										<SelectItem value="{prefix}{number}">
											INV0001
										</SelectItem>
										<SelectItem value="{prefix}_{number}">
											INV_0001
										</SelectItem>
										<SelectItem value="{number}">
											0001
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="p-4 bg-muted rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<Hash className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm font-medium">
										Preview
									</span>
								</div>
								<Badge className="text-sm" variant="outline">
									{settings.invoice_number_format
										.replace(
											'{prefix}',
											settings.invoice_prefix,
										)
										.replace(
											'{number}',
											settings.invoice_counter
												.toString()
												.padStart(4, '0'),
										)}
								</Badge>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Custom Fields */}
				<TabsContent className="space-y-6" value="custom-fields">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Plus className="h-5 w-5" />
								Custom Fields
							</CardTitle>
							<CardDescription>
								Add custom fields to collect additional
								information on your invoices. These fields will
								appear on the left side of the totals section.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{!settingsToUpdate.custom_fields ||
							settingsToUpdate.custom_fields.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									<Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
									<p className="text-sm">
										No custom fields configured. Add your
										first custom field to get started.
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{settingsToUpdate.custom_fields.map(
										(field, index) => (
											<Card
												className="p-4"
												key={field.id}
											>
												<div className="space-y-4">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															{getFieldIcon(
																field.type,
															)}
															<span className="font-medium">
																Field{' '}
																{index + 1}
															</span>
															<Badge
																className="text-xs"
																variant="outline"
															>
																{field.type}
															</Badge>
															{field.required && (
																<Badge
																	className="text-xs"
																	variant="destructive"
																>
																	Required
																</Badge>
															)}
														</div>
														<Button
															className="text-destructive hover:text-destructive"
															onClick={() =>
																removeCustomField(
																	field.id,
																)
															}
															size="sm"
															variant="ghost"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>

													<div className="grid grid-cols-2 gap-4">
														<div className="space-y-2">
															<Label className="flex items-center gap-2">
																<Type className="h-4 w-4" />
																Field Label
															</Label>
															<Input
																onChange={(e) =>
																	updateCustomField(
																		field.id,
																		{
																			label: e
																				.target
																				.value,
																		},
																	)
																}
																placeholder="Enter field label"
																value={
																	field.label
																}
															/>
														</div>
														<div className="space-y-2">
															<Label className="flex items-center gap-2">
																<SettingsIcon className="h-4 w-4" />
																Field Type
															</Label>
															<Select
																onValueChange={(
																	value:
																		| 'text'
																		| 'number'
																		| 'date',
																) =>
																	updateCustomField(
																		field.id,
																		{
																			type: value,
																		},
																	)
																}
																value={
																	field.type
																}
															>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="text">
																		Text
																	</SelectItem>
																	<SelectItem value="number">
																		Number
																	</SelectItem>
																	<SelectItem value="date">
																		Date
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</div>

													<div className="grid grid-cols-2 gap-4">
														<div className="space-y-2">
															<Label className="flex items-center gap-2">
																<FileText className="h-4 w-4" />
																Default Value
																(Optional)
															</Label>
															<Input
																onChange={(e) =>
																	updateCustomField(
																		field.id,
																		{
																			defaultValue:
																				e
																					.target
																					.value,
																		},
																	)
																}
																placeholder="Enter default value"
																value={
																	field.defaultValue
																}
															/>
														</div>
														<div className="space-y-2">
															<Label className="flex items-center gap-2">
																<AlertTriangle className="h-4 w-4" />
																Required Field
															</Label>
															<div className="flex items-center space-x-2 pt-2">
																<Switch
																	defaultChecked={
																		field.required
																	}
																	onCheckedChange={(
																		checked,
																	) =>
																		updateCustomField(
																			field.id,
																			{
																				required:
																					checked,
																			},
																		)
																	}
																/>
																<span className="text-sm text-muted-foreground">
																	{field.required
																		? 'Required'
																		: 'Optional'}
																</span>
															</div>
														</div>
													</div>
												</div>
											</Card>
										),
									)}
								</div>
							)}

							<div className="flex justify-center pt-4">
								<Button
									className="gap-2"
									onClick={addCustomField}
								>
									<Plus className="h-4 w-4" />
									Add Custom Field
								</Button>
							</div>

							{settings.custom_fields &&
								settings.custom_fields.length > 0 && (
									<div className="mt-6 p-4 bg-muted/50 rounded-lg">
										<div className="flex items-start gap-2">
											<AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
											<div className="text-sm text-muted-foreground">
												<p className="font-medium mb-1">
													Custom Fields Preview:
												</p>
												<p>
													These fields will appear on
													the left side of the totals
													section in your invoice
													preview. Required fields
													must be filled before
													proceeding to the final
													step.
												</p>
											</div>
										</div>
									</div>
								)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
