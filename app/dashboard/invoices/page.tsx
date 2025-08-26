"use client";

import type { Metadata } from "next";
import { useRouter } from "next/navigation";
import { InvoiceHistory } from "@/components/InvoiceHistory";
import type { SavedInvoice } from "@/lib/invoice-service";

export const metadata: Metadata = {
  title: "Invoices",
  description:
    "Create, manage, and track your invoices with Invoicr. Generate professional invoices in minutes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InvoicesPage() {
  const router = useRouter();

  const handleEditInvoice = (invoice: SavedInvoice) => {
    router.push(`/dashboard/create?edit=${invoice.id}`);
  };

  const handleViewInvoice = (invoice: SavedInvoice) => {
    router.push(`/dashboard/create?view=${invoice.id}`);
  };

  return (
    <InvoiceHistory
      onEditInvoice={handleEditInvoice}
      onViewInvoice={handleViewInvoice}
    />
  );
}
