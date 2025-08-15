-- Manual setup script for user_settings table
-- Run this in your Supabase SQL Editor if the migration doesn't work automatically

-- Create user_settings table for storing user preferences
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Company/Business Information
    company_name TEXT,
    company_email TEXT,
    company_phone TEXT,
    company_address TEXT,
    company_website TEXT,
    company_logo TEXT, -- base64 encoded logo
    
    -- Invoice Defaults
    default_theme TEXT DEFAULT 'professional-blue',
    default_currency TEXT DEFAULT 'USD',
    default_tax_rate DECIMAL(5,2) DEFAULT 0.00,
    default_payment_terms TEXT DEFAULT 'Net 30',
    default_notes TEXT,
    
    -- Notification Preferences
    email_notifications BOOLEAN DEFAULT true,
    payment_reminders BOOLEAN DEFAULT true,
    invoice_updates BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    
    -- Display Preferences
    date_format TEXT DEFAULT 'MM/DD/YYYY',
    number_format TEXT DEFAULT 'US', -- US, EU, etc.
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    
    -- Invoice Numbering
    invoice_prefix TEXT DEFAULT 'INV',
    invoice_counter INTEGER DEFAULT 1,
    invoice_number_format TEXT DEFAULT '{prefix}-{number}', -- {prefix}-{number}, {prefix}{number}, etc.
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
