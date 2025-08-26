export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Invoicr",
    description:
      "Professional invoice generation software that helps businesses create, manage, and send invoices efficiently.",
    url: "https://invoicrapp.com",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free invoice generator with premium features",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
    featureList: [
      "Professional invoice templates",
      "Client management",
      "Invoice customization",
      "PDF export",
      "Analytics dashboard",
      "Multi-currency support",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
