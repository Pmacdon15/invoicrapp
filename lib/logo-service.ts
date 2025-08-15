import { supabase } from '@/integrations/supabase/client';

export interface LogoUploadResult {
  url: string;
  path: string;
}

// Upload logo to Supabase Storage
export const uploadLogo = async (file: File): Promise<LogoUploadResult | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create unique filename with user ID folder structure
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('invoice-logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading logo:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('invoice-logos')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('Error uploading logo:', error);
    return null;
  }
};

// Delete logo from Supabase Storage
export const deleteLogo = async (logoPath: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    // Verify user owns this logo (security check)
    if (!logoPath.startsWith(`${user.id}/`)) {
      console.error('User does not own this logo');
      return false;
    }

    const { error } = await supabase.storage
      .from('invoice-logos')
      .remove([logoPath]);

    if (error) {
      console.error('Error deleting logo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting logo:', error);
    return false;
  }
};

// Get logo URL from path
export const getLogoUrl = (logoPath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from('invoice-logos')
    .getPublicUrl(logoPath);
  
  return publicUrl;
};

// Extract logo path from URL
export const getLogoPathFromUrl = (logoUrl: string): string | null => {
  try {
    const url = new URL(logoUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'invoice-logos');
    
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      return null;
    }
    
    return pathParts.slice(bucketIndex + 1).join('/');
  } catch (error) {
    console.error('Error extracting logo path from URL:', error);
    return null;
  }
};

// Check if URL is a Supabase Storage URL
export const isStorageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.includes('/storage/v1/object/public/invoice-logos/');
  } catch {
    return false;
  }
};

