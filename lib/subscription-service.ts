import { supabase } from '../integrations/supabase/client';

// Type casting for subscriptions table until Supabase types are regenerated
const subscriptionsTable = 'subscriptions' as any;

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  invoices_created_this_month: number;
  invoice_limit: number;
  usage_reset_date: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface UsageInfo {
  current: number;
  limit: number;
  remaining: number;
  percentage: number;
  canCreate: boolean;
  planType: 'free' | 'pro';
}

export class SubscriptionService {
  /**
   * Get user's subscription information
   */
  static async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const { data, error } = await (supabase as any)
        .from(subscriptionsTable)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data as Subscription;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  /**
   * Get user's current usage information
   */
  static async getUserUsage(userId: string): Promise<UsageInfo> {
    try {
      let subscription = await this.getUserSubscription(userId);

      // Create default free subscription if none exists
      if (!subscription) {
        subscription = await this.createFreeSubscription(userId);
      }

      const current = subscription.invoices_created_this_month;
      const limit = subscription.plan_type === 'pro' ? Infinity : subscription.invoice_limit;
      const remaining = subscription.plan_type === 'pro' ? Infinity : Math.max(0, limit - current);
      const percentage = subscription.plan_type === 'pro' ? 0 : Math.min(100, (current / limit) * 100);
      const canCreate = subscription.plan_type === 'pro' || current < limit;

      return {
        current,
        limit: subscription.plan_type === 'pro' ? Infinity : limit,
        remaining,
        percentage,
        canCreate,
        planType: subscription.plan_type
      };
    } catch (error) {
      console.error('Error getting user usage:', error);
      // Return safe defaults
      return {
        current: 0,
        limit: 8,
        remaining: 8,
        percentage: 0,
        canCreate: true,
        planType: 'free'
      };
    }
  }

  /**
   * Check if user can create an invoice
   */
  static async canCreateInvoice(userId: string): Promise<boolean> {
    try {
      const { data, error } = await (supabase as any)
        .rpc('can_create_invoice', { user_uuid: userId });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking invoice creation permission:', error);
      return false;
    }
  }

  /**
   * Increment user's invoice usage
   */
  static async incrementInvoiceUsage(userId: string): Promise<boolean> {
    try {
      const { data, error } = await (supabase as any)
        .rpc('increment_invoice_usage', { user_uuid: userId });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error incrementing invoice usage:', error);
      return false;
    }
  }

  /**
   * Create a free subscription for new users
   */
  static async createFreeSubscription(userId: string): Promise<Subscription> {
    try {
      const { data, error } = await (supabase as any)
        .from(subscriptionsTable)
        .insert({
          user_id: userId,
          plan_type: 'free',
          status: 'active',
          invoices_created_this_month: 0,
          invoice_limit: 8
        })
        .select()
        .single();

      if (error) throw error;
      return data as Subscription;
    } catch (error) {
      console.error('Error creating free subscription:', error);
      throw error;
    }
  }

  /**
   * Update user's subscription plan
   */
  static async updateSubscriptionPlan(
    userId: string, 
    planType: 'free' | 'pro',
    stripeData?: {
      subscriptionId?: string;
      customerId?: string;
      currentPeriodStart?: string;
      currentPeriodEnd?: string;
    }
  ): Promise<Subscription> {
    try {
      const updateData: any = {
        plan_type: planType,
        status: 'active',
        updated_at: new Date().toISOString()
      };

      // Set limits based on plan
      if (planType === 'free') {
        updateData.invoice_limit = 8;
        // Clear Stripe data for free plan
        updateData.stripe_subscription_id = null;
        updateData.stripe_customer_id = null;
        updateData.current_period_start = null;
        updateData.current_period_end = null;
      } else if (planType === 'pro') {
        updateData.invoice_limit = 999999; // Effectively unlimited
        // Add Stripe data for pro plan
        if (stripeData) {
          updateData.stripe_subscription_id = stripeData.subscriptionId;
          updateData.stripe_customer_id = stripeData.customerId;
          updateData.current_period_start = stripeData.currentPeriodStart;
          updateData.current_period_end = stripeData.currentPeriodEnd;
        }
      }

      const { data, error } = await (supabase as any)
        .from(subscriptionsTable)
        .upsert({
          user_id: userId,
          ...updateData
        })
        .select()
        .single();

      if (error) throw error;
      return data as Subscription;
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      throw error;
    }
  }

  /**
   * Update invoice limit for free plan (admin function)
   */
  static async updateInvoiceLimit(userId: string, newLimit: number): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from(subscriptionsTable)
        .update({
          invoice_limit: newLimit,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('plan_type', 'free');

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating invoice limit:', error);
      return false;
    }
  }

  /**
   * Cancel user's subscription
   */
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from(subscriptionsTable)
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  /**
   * Reset monthly usage (called automatically by database function)
   */
  static async resetMonthlyUsage(): Promise<boolean> {
    try {
      const { error } = await (supabase as any).rpc('reset_monthly_usage');
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error resetting monthly usage:', error);
      return false;
    }
  }
}
