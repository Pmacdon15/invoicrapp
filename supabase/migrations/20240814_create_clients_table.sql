-- Create clients table for storing client information
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Client basic information
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Address information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Additional client details
    tax_number VARCHAR(50),
    website VARCHAR(255),
    notes TEXT,
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS clients_name_idx ON public.clients(name);
CREATE INDEX IF NOT EXISTS clients_email_idx ON public.clients(email);
CREATE INDEX IF NOT EXISTS clients_company_name_idx ON public.clients(company_name);
CREATE INDEX IF NOT EXISTS clients_is_active_idx ON public.clients(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients
CREATE POLICY "Users can view their own clients" ON public.clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON public.clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" ON public.clients
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for clients
CREATE TRIGGER handle_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
