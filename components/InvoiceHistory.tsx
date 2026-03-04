'use client'
import { format } from 'date-fns'
import {
	Calendar,
	CircleCheck,
	DollarSign,
	Edit,
	Eye,
	FileText,
	MoreVertical,
	Send,
	Trash2,
	User,
} from 'lucide-react'
import Link from 'next/link'
import { use, useState } from 'react'
import { deleteInvoice, updateInvoiceStatus } from '@/actions/invoices'
import { InvoicePreview } from '@/components/invoice/InvoicePreview'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { showError, showSuccess } from '@/hooks/use-toast'
import type { SavedInvoice } from '@/lib/invoice-service'
import {
	getDefaultTheme,
	getThemeById,
	getThemeMetadataSync,
} from '@/lib/invoice-themes'
import type { InvoiceData, InvoiceTheme } from '@/types/invoice'
import type { UserSettings } from '@/types/settings'
import { SortButton } from './client-management/sort-button'
import SearchFilter from './invoice-history/search-filter'

// interface InvoiceHistoryProps {
// 	onEditInvoice?: (invoice: SavedInvoice) => void
// 	onViewInvoice?: (invoice: SavedInvoice) => void
// }

const statusColors = {
	draft: 'bg-gray-100 text-gray-800 border-gray-200',
	sent: 'bg-blue-100 text-blue-800 border-blue-200',
	paid: 'bg-green-100 text-green-800 border-green-200',
	overdue: 'bg-red-100 text-red-800 border-red-200',
	cancelled: 'bg-orange-100 text-orange-800 border-orange-200',
}

const statusLabels = {
	draft: 'Draft',
	sent: 'Sent',
	paid: 'Paid',
	overdue: 'Overdue',
	cancelled: 'Cancelled',
}

export default function InvoiceHistory({
	filterPromise,
	invoicesPromise,
	userSettingsPromise,
	sortPromise,
	orderPromise,
	searchTermPromise,
}: {
	filterPromise: Promise<
		'all' | 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
	>
	invoicesPromise: Promise<SavedInvoice[]>
	userSettingsPromise: Promise<UserSettings | null>
	sortPromise: Promise<
		| 'invoice_number'
		| 'client_name'
		| 'invoice_date'
		| 'total_amount'
		| 'status'
		| 'invoice_date'
	>
	orderPromise: Promise<'asc' | 'desc'>
	searchTermPromise: Promise<string>
}) {
	// const [invoices, setInvoices] = useState<SavedInvoice[]>([])
	const invoices = use(invoicesPromise)
	const userSettings = use(userSettingsPromise)
	const filterBy = use(filterPromise)
	const sortBy = use(sortPromise)
	const sortOrder = use(orderPromise)
	const searchTerm = use(searchTermPromise)

	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [previewInvoice, setPreviewInvoice] = useState<SavedInvoice | null>(
		null,
	)
	const [previewInvoiceData, setPreviewInvoiceData] =
		useState<InvoiceData | null>(null)
	const [showPreviewDialog, setShowPreviewDialog] = useState(false)

	const handleDeleteInvoice = async (id: string) => {
		setDeletingId(id)
		try {
			const success = await deleteInvoice(id)
			if (success) {
				showSuccess(
					'Invoice Deleted',
					'Invoice has been successfully deleted.',
				)
			} else {
				showError(
					'Error Deleting Invoice',
					'Failed to delete the invoice. Please try again.',
				)
			}
		} catch (error) {
			console.error('Error deleting invoice:', error)
			showError(
				'Error Deleting Invoice',
				'Failed to delete the invoice. Please try again.',
			)
		} finally {
			setDeletingId(null)
		}
	}

	const handleStatusUpdate = async (
		id: string,
		newStatus: SavedInvoice['status'],
	) => {
		try {
			const success = await updateInvoiceStatus(id, newStatus)
			if (success) {
				showSuccess(
					'Status Updated',
					`Invoice status updated to ${statusLabels[newStatus]}.`,
				)
			} else {
				showError(
					'Error Updating Status',
					'Failed to update invoice status. Please try again.',
				)
			}
		} catch (error) {
			console.error('Error updating status:', error)
			showError(
				'Error Updating Status',
				'Failed to update invoice status. Please try again.',
			)
		}
	}

	// Convert SavedInvoice to InvoiceData format for preview
	const convertToInvoiceData = (
		savedInvoice: SavedInvoice,
		theme: InvoiceTheme,
	): InvoiceData => {
		return {
			theme: theme,
			client: {
				name: savedInvoice.client_name,
				address: savedInvoice.client_address,
				email: savedInvoice.client_email || undefined,
				phone: savedInvoice.client_phone || undefined,
			},
			items: savedInvoice.items,
			invoiceNumber: savedInvoice.invoice_number,
			date: savedInvoice.invoice_date,
			dueDate: savedInvoice.due_date,
			notes: savedInvoice.notes || undefined,
			currency: 'USD',
			paymentTerms: 'Net 30',
			taxRate:
				savedInvoice.subtotal > 0
					? (savedInvoice.tax_amount / savedInvoice.subtotal) * 100
					: 0,
			customFields: savedInvoice.custom_fields || [],
		}
	}

	const handlePreviewInvoice = async (invoice: SavedInvoice) => {
		setPreviewInvoice(invoice)
		try {
			const theme =
				(await getThemeById(invoice.theme_id)) ||
				(await getDefaultTheme())
			const data = convertToInvoiceData(invoice, theme)
			setPreviewInvoiceData(data)
			setShowPreviewDialog(true)
		} catch (error) {
			console.error('Error loading theme for preview:', error)
			// Fallback if theme fails to load
			const themeMetadata = getThemeMetadataSync(invoice.theme_id)
			const fallbackTheme: InvoiceTheme = {
				id: invoice.theme_id,
				name: invoice.theme_name,
				color: themeMetadata?.id.split('-')[1] || 'blue',
				description: themeMetadata?.description || 'Professional theme',
				version: themeMetadata?.version || '1.0.0',
				author: themeMetadata?.author || 'Invoicr',
				preview: themeMetadata?.preview || {
					primary: '#3b82f6',
					secondary: '#dbeafe',
					accent: '#1e40af',
				},
				styles: {
					primary: `text-invoice-${themeMetadata?.id.split('-')[1] || 'blue'}`,
					primaryLight: `bg-invoice-${
						themeMetadata?.id.split('-')[1] || 'blue'
					}-light`,
					text: `text-invoice-${themeMetadata?.id.split('-')[1] || 'blue'}`,
					background: `bg-invoice-${
						themeMetadata?.id.split('-')[1] || 'blue'
					}-light`,
					border: `border-invoice-${themeMetadata?.id.split('-')[1] || 'blue'}`,
				},
				layout: {
					headerStyle: 'classic',
					footerStyle: 'minimal',
					spacing: 'comfortable',
					typography: {
						headerFont: 'font-semibold',
						bodyFont: 'font-normal',
						accentFont: 'font-medium',
					},
				},
				customCSS: '',
			}
			const data = convertToInvoiceData(invoice, fallbackTheme)
			setPreviewInvoiceData(data)
			setShowPreviewDialog(true)
		}
	}

	const filteredAndSortedInvoices = invoices
		.filter((invoice) => {
			// Status filtering logic (similar to your with-invoices/no-invoices style)
			if (filterBy === 'paid') return invoice.status === 'paid'
			if (filterBy === 'overdue') return invoice.status === 'overdue'
			if (filterBy === 'draft') return invoice.status === 'draft'
			if (filterBy === 'sent') return invoice.status === 'sent'
			if (filterBy === 'cancelled') return invoice.status === 'cancelled'

			// If 'all' or no match, show everything (search is already applied elsewhere)
			return true
		})
		.sort((a, b) => {
			let comparison = 0

			// Your guard logic to ensure we only sort by allowed keys
			const s =
				sortBy === 'invoice_number' ||
				sortBy === 'client_name' ||
				sortBy === 'status' ||
				sortBy === 'invoice_date'
					? sortBy
					: 'invoice_number'

			switch (s) {
				case 'invoice_number':
					comparison = a.invoice_number.localeCompare(
						b.invoice_number,
					)
					break
				case 'client_name':
					comparison = a.client_name.localeCompare(b.client_name)
					break
				case 'status':
					comparison = a.status.localeCompare(b.status)
					break
				case 'invoice_date':
					comparison =
						new Date(a.invoice_date).getTime() -
						new Date(b.invoice_date).getTime()
					break
			}

			return sortOrder === 'asc' ? comparison : -comparison
		})

	return (
		<div className="space-y-6 w-full">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">
						Invoices
					</h2>
					<p className="text-gray-600 mt-1">
						Manage and track all your invoices in one place
					</p>
				</div>
				{/* //TODO:maybe add something for a call back but with this set up we should need to revlidate here */}
				{/* <Button onClick={loadInvoices} size="sm" variant="outline">
					<RefreshCcw className="w-4 h-4 mr-2" />
					Refresh
				</Button> */}
			</div>

			{/* Search and Filters */}
			<SearchFilter filterBy={filterBy} searchTerm={searchTerm} />

			{/* Invoices Table */}
			{filteredAndSortedInvoices.length === 0 ? (
				<div className="text-center py-16">
					<FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						No Invoices Found
					</h3>
					<p className="text-gray-600 mb-4">
						{filterBy !== 'all'
							? 'No invoices match your current filters.'
							: 'Start creating invoices to see them appear in your history.'}
					</p>
				</div>
			) : (
				<div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="bg-gray-50">
								<TableHead className="w-8">
									{/* Status */}
								</TableHead>
								<TableHead>
									<SortButton
										column={'invoice_number'}
										label={'Invoice #'}
									/>	
								</TableHead>
								<TableHead>
									<SortButton
										column={'client_name'}
										label={'Client'}
									/>	
								</TableHead>
								<TableHead>
									<SortButton
										column={'invoice_date'}
										label={'Date'}
									/>	
								</TableHead>
								<TableHead>
									<SortButton
										column={'total_amount'}
										label={'Total'}
									/>	
								</TableHead>
								<TableHead>
									<SortButton
										column={'status'}
										label={'Status'}
									/>								
								</TableHead>
								<TableHead className="w-20">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredAndSortedInvoices.map((invoice) => (
								<TableRow
									className="cursor-pointer hover:bg-gray-50"
									key={invoice.id}
									onClick={() =>
										handlePreviewInvoice(invoice)
									}
								>
									<TableCell>
										<div
											className={`w-3 h-3 rounded-full ${
												invoice.status === 'paid'
													? 'bg-green-500'
													: invoice.status === 'sent'
														? 'bg-blue-500'
														: invoice.status ===
																'overdue'
															? 'bg-red-500'
															: invoice.status ===
																	'cancelled'
																? 'bg-orange-500'
																: 'bg-gray-500'
											}`}
										></div>
									</TableCell>
									<TableCell>
										<div className="font-semibold text-gray-900">
											{invoice.invoice_number}
										</div>
										<div className="text-sm text-gray-500">
											Created{' '}
											{format(
												new Date(invoice.created_at),
												'MMM dd, yyyy',
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<User className="w-4 h-4 text-gray-400" />
											<span className="text-gray-900">
												{invoice.client_name}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Calendar className="w-4 h-4 text-gray-400" />
											<span className="text-gray-900">
												{format(
													new Date(
														invoice.invoice_date,
													),
													'MMM dd, yyyy',
												)}
											</span>
										</div>
										<div className="text-sm text-gray-500">
											Due:{' '}
											{format(
												new Date(invoice.due_date),
												'MMM dd, yyyy',
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<DollarSign className="w-4 h-4 text-gray-400" />
											<span className="font-semibold text-gray-900">
												$
												{invoice.total_amount.toFixed(
													2,
												)}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											className={`${
												statusColors[
													invoice.status as keyof typeof statusColors
												]
											}`}
											variant="outline"
										>
											{
												statusLabels[
													invoice.status as keyof typeof statusLabels
												]
											}
										</Badge>
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													className="h-8 w-8 p-0"
													onClick={(e) =>
														e.stopPropagation()
													}
													size="sm"
													variant="ghost"
												>
													<MoreVertical className="w-4 h-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														handlePreviewInvoice(
															invoice,
														)
													}
												>
													<Eye className="w-4 h-4 mr-2" />
													View
												</DropdownMenuItem>
												<Link
													href={`/dashboard/create?editId=${invoice.id}`}
												>
													<DropdownMenuItem>
														<Edit className="w-4 h-4 mr-2" />
														Edit
													</DropdownMenuItem>
												</Link>
												<DropdownMenuItem
													onClick={() =>
														handleStatusUpdate(
															invoice.id,
															'sent',
														)
													}
												>
													<Send className="w-4 h-4 mr-2" />
													Mark as Sent
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleStatusUpdate(
															invoice.id,
															'paid',
														)
													}
												>
													<CircleCheck className="w-4 h-4 mr-2" />
													Mark as Paid
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-red-600"
													disabled={
														deletingId ===
														invoice.id
													}
													onClick={() =>
														handleDeleteInvoice(
															invoice.id,
														)
													}
												>
													<Trash2 className="w-4 h-4 mr-2" />
													{deletingId === invoice.id
														? 'Deleting...'
														: 'Delete'}
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Invoice Preview Dialog */}
			<Dialog
				onOpenChange={setShowPreviewDialog}
				open={showPreviewDialog}
			>
				<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Eye className="w-5 h-5" />
							Invoice Preview - {previewInvoice?.invoice_number}
						</DialogTitle>
					</DialogHeader>

					{previewInvoiceData && (
						<div className="mt-4">
							<InvoicePreview
								invoiceData={previewInvoiceData}
								userSettings={userSettings}
							/>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
