import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/contexts/AuthContext";
import { UsageProvider } from "@/contexts/UsageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Providers } from './providers'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Invoicr',
  description: 'Professional invoice generation made simple',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <AuthProvider>
            <UsageProvider>
              <Toaster />
              <Sonner />
              <Analytics />
              {children}
            </UsageProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
