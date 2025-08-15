-- Simplify clients table to store only essential client information
-- Remove unnecessary columns and keep only: name, address, email, phone, tax_number, website

-- Drop columns we don't need
ALTER TABLE public.clients DROP COLUMN IF EXISTS company_name;
ALTER TABLE public.clients DROP COLUMN IF EXISTS address_line1;
ALTER TABLE public.clients DROP COLUMN IF EXISTS address_line2;
ALTER TABLE public.clients DROP COLUMN IF EXISTS city;
ALTER TABLE public.clients DROP COLUMN IF EXISTS state;
ALTER TABLE public.clients DROP COLUMN IF EXISTS postal_code;
ALTER TABLE public.clients DROP COLUMN IF EXISTS country;
ALTER TABLE public.clients DROP COLUMN IF EXISTS notes;
ALTER TABLE public.clients DROP COLUMN IF EXISTS is_active;

-- Add a single address field to replace the multiple address fields
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS address TEXT;

-- Update the existing indexes to match the simplified structure
DROP INDEX IF EXISTS clients_company_name_idx;
DROP INDEX IF EXISTS clients_is_active_idx;

-- The table now has the structure:
-- id, user_id, name, email, phone, tax_number, website, address, created_at, updated_at

-- Note: Each user manages their own clients (clients are not app users)
-- The user_id field references the authenticated user who owns these client records
