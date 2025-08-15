-- Create invoices table for storing invoice history
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    
    -- Client information
    client_name VARCHAR(255) NOT NULL,
    client_address TEXT NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    
    -- Invoice details
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    theme_id VARCHAR(50) NOT NULL,
    theme_name VARCHAR(100) NOT NULL,
    
    -- Items as JSONB for flexibility
    items JSONB NOT NULL,
    
    -- Calculated totals
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status and metadata
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_invoice_number_idx ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" ON public.invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" ON public.invoices
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" ON public.invoices
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
