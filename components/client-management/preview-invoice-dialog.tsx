import { Eye, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { SavedInvoice } from '@/lib/invoice-service'
import {
    getDefaultTheme,
    getThemeById,
    getThemeMetadataSync,
} from '@/lib/invoice-themes'
import type { InvoiceData, InvoiceTheme } from '@/types/invoice'
import { InvoicePreview } from '../invoice/InvoicePreview'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

const convertToInvoiceData = (
	savedInvoice: SavedInvoice,
	theme: InvoiceTheme,
): InvoiceData => {
	return {
		theme: theme,
		client: {
			name: savedInvoice.client_name || 'Unknown Client',
			address: savedInvoice.client_address || '',
			email: savedInvoice.client_email || undefined,
			phone: savedInvoice.client_phone || undefined,
		},
		items: savedInvoice.items || [],
		invoiceNumber: savedInvoice.invoice_number || 'INV-000',
		date: savedInvoice.invoice_date || new Date().toISOString(),
		dueDate: savedInvoice.due_date || new Date().toISOString(),
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

export default function PreviewInvoiceDialog({
	setShowPreviewDialog,
	showPreviewDialog,
	previewInvoice,
	isSaved,
	setIsSaved,
	userSettings,
}) {
	const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const loadThemeData = async () => {
			if (!previewInvoice) {
				setInvoiceData(null)
				return
			}

			setIsLoading(true)
			try {
				const themeId =
					previewInvoice.theme_id ||
					userSettings?.default_theme ||
					'professional-blue'
				const theme =
					(await getThemeById(themeId)) || (await getDefaultTheme())
				const data = convertToInvoiceData(previewInvoice, theme)
				setInvoiceData(data)
			} catch (error) {
				console.error('Error loading theme for preview:', error)
				// Fallback if theme fails to load
				const themeId =
					previewInvoice.theme_id ||
					userSettings?.default_theme ||
					'professional-blue'
				const themeMetadata = getThemeMetadataSync(themeId)
				const themeColor = themeMetadata?.id.split('-')[1] || 'blue'

				const fallbackTheme: InvoiceTheme = {
					id: themeId,
					name: previewInvoice.theme_name || 'Default Theme',
					color: themeColor,
					description:
						themeMetadata?.description || 'Professional theme',
					version: themeMetadata?.version || '1.0.0',
					author: themeMetadata?.author || 'Invoicr',
					preview: themeMetadata?.preview || {
						primary: '#3b82f6',
						secondary: '#dbeafe',
						accent: '#1e40af',
					},
					styles: {
						primary: `text-invoice-${themeColor}`,
						primaryLight: `bg-invoice-${themeColor}-light`,
						text: `text-invoice-${themeColor}`,
						background: `bg-invoice-${themeColor}-light`,
						border: `border-invoice-${themeColor}`,
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
				const data = convertToInvoiceData(previewInvoice, fallbackTheme)
				setInvoiceData(data)
			} finally {
				setIsLoading(false)
			}
		}

		if (showPreviewDialog) {
			loadThemeData()
		}
	}, [previewInvoice, showPreviewDialog, userSettings])

	return (
		<Dialog onOpenChange={setShowPreviewDialog} open={showPreviewDialog}>
			<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Eye className="w-5 h-5" />
						Invoice Preview - {previewInvoice?.invoice_number}
					</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<div className="flex justify-center items-center py-12">
						<Loader2 className="w-8 h-8 animate-spin text-primary" />
					</div>
				) : invoiceData && previewInvoice ? (
					<div className="mt-4">
						<InvoicePreview
							invoiceData={invoiceData}
							isSaved={isSaved}
							setIsSaved={setIsSaved}
							userSettings={userSettings}
						/>
					</div>
				) : null}
			</DialogContent>
		</Dialog>
	)
}
