import { isStorageUrl } from './logo-service';

// Get the logo URL for display (only Supabase Storage URLs)
export const getDisplayLogoUrl = (savedInvoice: { logo_url?: string }): string | undefined => {
  if (savedInvoice.logo_url && isStorageUrl(savedInvoice.logo_url)) {
    return savedInvoice.logo_url;
  }
  
  return undefined;
};

// Get logo for editing (only Supabase Storage URLs)
export const getEditingLogo = (savedInvoice: { logo_url?: string }): string | undefined => {
  return getDisplayLogoUrl(savedInvoice);
};
