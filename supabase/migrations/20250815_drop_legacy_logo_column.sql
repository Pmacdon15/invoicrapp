-- Drop the legacy logo column (base64 data)
-- This migration removes the old base64 logo storage in favor of logo_url (Supabase Storage)

ALTER TABLE invoices DROP COLUMN IF EXISTS logo;
