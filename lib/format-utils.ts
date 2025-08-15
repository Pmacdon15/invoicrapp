import type { SettingsFormData } from '@/types/settings';

// Currency symbols mapping
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
};

// Get currency symbol
export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};

// Format currency amount
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  numberFormat: string = 'US'
): string => {
  const symbol = getCurrencySymbol(currency);
  
  // Format based on locale
  switch (numberFormat) {
    case 'EU':
      // European format: 1.234,56 €
      return `${amount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ${symbol}`;
    case 'IN':
      // Indian format: ₹1,23,456.78
      return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'US':
    default:
      // US format: $1,234.56
      return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

// Format date based on user preference
export const formatDate = (
  dateString: string, 
  format: string = 'MM/DD/YYYY'
): string => {
  const date = new Date(dateString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`;
    case 'MM/DD/YYYY':
    default:
      return `${month}/${day}/${year}`;
  }
};

// Format number based on locale
export const formatNumber = (
  number: number, 
  numberFormat: string = 'US'
): string => {
  switch (numberFormat) {
    case 'EU':
      return number.toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    case 'IN':
      return number.toLocaleString('en-IN');
    case 'US':
    default:
      return number.toLocaleString('en-US');
  }
};

// Calculate totals with tax
export const calculateInvoiceTotals = (
  items: Array<{ quantity: number; price: number }>,
  taxRate: number = 0
) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  
  return {
    subtotal,
    taxAmount,
    taxRate,
    total
  };
};

// Get user formatting preferences
export const getUserFormatPreferences = (settings: SettingsFormData) => {
  return {
    currency: settings.default_currency,
    dateFormat: settings.date_format,
    numberFormat: settings.number_format,
    taxRate: settings.default_tax_rate
  };
};

// Calculate due date based on payment terms
export const calculateDueDate = (
  invoiceDate: string,
  paymentTerms: string = 'Net 30'
): string => {
  const date = new Date(invoiceDate);
  
  // Parse common payment terms
  const terms = paymentTerms.toLowerCase().trim();
  
  if (terms === 'due on receipt' || terms === 'due upon receipt') {
    return invoiceDate; // Same as invoice date
  }
  
  if (terms === 'cash on delivery' || terms === 'cod') {
    return invoiceDate; // Same as invoice date
  }
  
  // Parse Net X terms (Net 30, Net 15, etc.)
  const netMatch = terms.match(/net\s*(\d+)/);
  if (netMatch) {
    const days = parseInt(netMatch[1]);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
  
  // Parse X/Y Net Z terms (2/10 Net 30)
  const discountMatch = terms.match(/\d+\/\d+\s*net\s*(\d+)/);
  if (discountMatch) {
    const days = parseInt(discountMatch[1]);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
  
  // Parse "X days" format
  const daysMatch = terms.match(/(\d+)\s*days?/);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
  
  // Default to 30 days if can't parse
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};
