
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { InvoiceGenerator } from '@/components/InvoiceGenerator'
import { getInvoiceById } from '@/lib/invoice-service'
import type { SavedInvoice } from '@/lib/invoice-service'

export default function CreateInvoicePage(props:PageProps<"/dashboard/create">) {

 const invoicePromise = props.searchParams.then(({ editId, viewId }) => {
    // Use .flat() or simple check to ensure you get a string
    const targetId = [editId, viewId].flat().filter(Boolean)[0];
  
    return getInvoiceById(targetId);
  });

  const router = useRouter()
  const searchParams = useSearchParams()
  const [editingInvoice, setEditingInvoice] = useState<SavedInvoice | null>(null)
  const [loadingInvoice, setLoadingInvoice] = useState(false)

  const editId = searchParams.get('edit')
  const viewId = searchParams.get('view')
  const invoiceId = editId || viewId

  useEffect(() => {
    const loadInvoice = async () => {
      if (invoiceId) {
        setLoadingInvoice(true)
        try {
          const invoice = await getInvoiceById(invoiceId)
          setEditingInvoice(invoice)
        } catch (error) {
          console.error('Error loading invoice:', error)
          // If invoice not found, redirect to create page without params
          router.replace('/dashboard/create')
        } finally {
          setLoadingInvoice(false)
        }
      }
    }

    loadInvoice()
  }, [invoiceId, router])

  if (loadingInvoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense>
    <InvoiceGenerator
      editingInvoicePromise={invoicePromise}
      onInvoiceSaved={() => null}
    />
    </Suspense>
  )
}
