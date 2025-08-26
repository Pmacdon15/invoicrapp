import type { Metadata } from "next";
import { ClientManagement } from "@/components/ClientManagement";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Manage your client database with Invoicr. Store client information and streamline your invoicing process.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClientsPage() {
  return <ClientManagement />;
}
