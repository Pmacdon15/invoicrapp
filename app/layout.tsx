import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { UsageProvider } from "@/contexts/UsageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Invoicr - Professional Invoice Generator | Create Invoices Fast",
    template: "%s | Invoicr",
  },
  description:
    "Create professional invoices in minutes with Invoicr. Streamline your billing process with our intuitive invoice generator. Manage clients, customize themes, and get paid faster.",
  keywords: [
    "invoice generator",
    "invoice maker",
    "professional invoices",
    "billing software",
    "invoice templates",
    "business invoicing",
    "freelancer invoices",
    "small business invoicing",
  ],
  authors: [{ name: "Invoicr Team" }],
  creator: "Invoicr",
  publisher: "Invoicr",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://invoicrapp.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://invoicrapp.com",
    title: "Invoicr - Professional Invoice Generator | Create Invoices Fast",
    description:
      "Create professional invoices in minutes with Invoicr. Streamline your billing process with our intuitive invoice generator.",
    siteName: "Invoicr",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Invoicr - Professional Invoice Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoicr - Professional Invoice Generator | Create Invoices Fast",
    description:
      "Create professional invoices in minutes with Invoicr. Streamline your billing process with our intuitive invoice generator.",
    images: ["/og-image.png"],
    creator: "@invoicr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
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
  );
}
