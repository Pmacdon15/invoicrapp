-- Create subscriptions table for user plans and usage tracking
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    
    -- Usage tracking
    invoices_created_this_month INTEGER NOT NULL DEFAULT 0,
    invoice_limit INTEGER NOT NULL DEFAULT 8, -- configurable limit
    usage_reset_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
    
    -- Subscription details
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one subscription per user
    UNIQUE(user_id)
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_usage_reset_date ON subscriptions(usage_reset_date);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to reset monthly usage
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
    UPDATE subscriptions 
    SET 
        invoices_created_this_month = 0,
        usage_reset_date = CURRENT_DATE + INTERVAL '1 month',
        updated_at = NOW()
    WHERE usage_reset_date <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to increment invoice usage
CREATE OR REPLACE FUNCTION increment_invoice_usage(user_uuid UUID)
RETURNS boolean AS $$
DECLARE
    current_usage INTEGER;
    usage_limit INTEGER;
    plan TEXT;
BEGIN
    -- Get current usage and limit
    SELECT invoices_created_this_month, invoice_limit, plan_type
    INTO current_usage, usage_limit, plan
    FROM subscriptions
    WHERE user_id = user_uuid;
    
    -- If no subscription exists, create free plan
    IF NOT FOUND THEN
        INSERT INTO subscriptions (user_id, plan_type, invoices_created_this_month, invoice_limit)
        VALUES (user_uuid, 'free', 1, 8);
        RETURN true;
    END IF;
    
    -- Pro users have unlimited invoices
    IF plan = 'pro' THEN
        UPDATE subscriptions 
        SET 
            invoices_created_this_month = invoices_created_this_month + 1,
            updated_at = NOW()
        WHERE user_id = user_uuid;
        RETURN true;
    END IF;
    
    -- Check if free user has reached limit
    IF current_usage >= usage_limit THEN
        RETURN false;
    END IF;
    
    -- Increment usage for free user
    UPDATE subscriptions 
    SET 
        invoices_created_this_month = invoices_created_this_month + 1,
        updated_at = NOW()
    WHERE user_id = user_uuid;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can create invoice
CREATE OR REPLACE FUNCTION can_create_invoice(user_uuid UUID)
RETURNS boolean AS $$
DECLARE
    current_usage INTEGER;
    usage_limit INTEGER;
    plan TEXT;
BEGIN
    -- Reset usage if needed
    PERFORM reset_monthly_usage();
    
    -- Get current usage and limit
    SELECT invoices_created_this_month, invoice_limit, plan_type
    INTO current_usage, usage_limit, plan
    FROM subscriptions
    WHERE user_id = user_uuid;
    
    -- If no subscription exists, user can create (will be created on first invoice)
    IF NOT FOUND THEN
        RETURN true;
    END IF;
    
    -- Pro users have unlimited invoices
    IF plan = 'pro' THEN
        RETURN true;
    END IF;
    
    -- Check if free user has reached limit
    RETURN current_usage < usage_limit;
END;
$$ LANGUAGE plpgsql;
