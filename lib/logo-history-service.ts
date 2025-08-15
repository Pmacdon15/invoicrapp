import { getUserInvoices, type SavedInvoice } from './invoice-service';

export interface UsedLogo {
  url: string;
  lastUsed: string;
  invoiceCount: number;
  invoiceNumbers: string[];
}

// Get unique logos used by the user from their invoice history
export const getUserLogoHistory = async (): Promise<UsedLogo[]> => {
  try {
    const invoices = await getUserInvoices();
    
    // Group invoices by logo_url
    const logoMap = new Map<string, {
      lastUsed: string;
      invoiceNumbers: string[];
    }>();

    invoices.forEach((invoice: SavedInvoice) => {
      if (invoice.logo_url) {
        const existing = logoMap.get(invoice.logo_url);
        if (existing) {
          existing.invoiceNumbers.push(invoice.invoice_number);
          // Update last used if this invoice is more recent
          if (new Date(invoice.updated_at) > new Date(existing.lastUsed)) {
            existing.lastUsed = invoice.updated_at;
          }
        } else {
          logoMap.set(invoice.logo_url, {
            lastUsed: invoice.updated_at,
            invoiceNumbers: [invoice.invoice_number]
          });
        }
      }
    });

    // Convert to UsedLogo array and sort by last used (most recent first)
    const usedLogos: UsedLogo[] = Array.from(logoMap.entries()).map(([url, data]) => ({
      url,
      lastUsed: data.lastUsed,
      invoiceCount: data.invoiceNumbers.length,
      invoiceNumbers: data.invoiceNumbers
    }));

    return usedLogos.sort((a, b) => 
      new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
    );
  } catch (error) {
    console.error('Error fetching logo history:', error);
    return [];
  }
};

// Get the most recently used logo
export const getMostRecentLogo = async (): Promise<string | null> => {
  const history = await getUserLogoHistory();
  return history.length > 0 ? history[0].url : null;
};
