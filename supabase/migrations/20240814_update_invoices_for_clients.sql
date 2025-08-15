-- Update invoices table to reference clients table
-- First, add the client_id column
ALTER TABLE public.invoices ADD COLUMN client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

-- Create index for the new foreign key
CREATE INDEX IF NOT EXISTS invoices_client_id_idx ON public.invoices(client_id);

-- Note: We'll keep the existing client_* columns for backward compatibility and direct client info storage
-- This allows for flexibility - invoices can either reference a stored client or have inline client data

-- Add a constraint to ensure either client_id is provided OR inline client data is provided
-- (This will be handled at the application level for flexibility)
