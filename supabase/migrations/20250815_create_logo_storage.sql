-- Create storage bucket for invoice logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-logos', 'invoice-logos', true);

-- Create RLS policy for logo uploads (users can only access their own logos)
CREATE POLICY "Users can upload their own logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'invoice-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create RLS policy for logo access (public read access)
CREATE POLICY "Public logo access" ON storage.objects
FOR SELECT USING (bucket_id = 'invoice-logos');

-- Create RLS policy for logo updates (users can only update their own logos)
CREATE POLICY "Users can update their own logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'invoice-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create RLS policy for logo deletion (users can only delete their own logos)
CREATE POLICY "Users can delete their own logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'invoice-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add logo_url column to invoices table
ALTER TABLE invoices ADD COLUMN logo_url TEXT;

-- Add comment to describe the logo_url column
COMMENT ON COLUMN invoices.logo_url IS 'URL to company logo stored in Supabase Storage';
