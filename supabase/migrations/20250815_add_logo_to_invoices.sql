-- Add logo column to invoices table
ALTER TABLE invoices ADD COLUMN logo TEXT;

-- Add comment to describe the logo column
COMMENT ON COLUMN invoices.logo IS 'Base64 encoded company logo or URL to logo image';
