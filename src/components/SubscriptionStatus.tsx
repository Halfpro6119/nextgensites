import React, { useEffect, useState } from 'react';
import { Crown, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';

interface SubscriptionData {
  subscription_status: string;
  price_id: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  payment_method_brand?: string;
  payment_method_last4?: string;
}

function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (user) {
          const { data, error } = await supabase
            .from('stripe_user_subscriptions')
            .select('*')
            .maybeSingle();

          if (error) {
            console.error('Error fetching subscription:', error);
          } else {
            setSubscription(data);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <Crown className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="text-white font-medium">No Active Plan</div>
            <div className="text-gray-400 text-sm">Choose a plan to get started</div>
          </div>
        </div>
      </div>
    );
  }

  const getPlanName = (priceId: string) => {
    switch (priceId) {
      case 'price_1REBaYHXLiaHMkNqjYxHxR7J':
        return 'Starter Website';
      case 'price_1REBb0HXLiaHMkNqWecx8tz0':
        return 'Full Website';
      case 'price_1RVcWzHXLiaHMkNqlr20ziNO':
        return 'Growth System';
      default:
        return 'Unknown Plan';
    }
  };

  const getPlanColor = (priceId: string) => {
    switch (priceId) {
      case 'price_1REBaYHXLiaHMkNqjYxHxR7J':
        return 'text-blue-400 bg-blue-500/20';
      case 'price_1REBb0HXLiaHMkNqWecx8tz0':
        return 'text-purple-400 bg-purple-500/20';
      case 'price_1RVcWzHXLiaHMkNqlr20ziNO':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const planName = getPlanName(subscription.price_id);
  const planColor = getPlanColor(subscription.price_id);
  const isActive = subscription.subscription_status === 'active';

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${planColor} flex items-center justify-center`}>
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-white font-bold text-lg">{planName}</div>
            <div className={`text-sm capitalize ${isActive ? 'text-green-400' : 'text-red-400'}`}>
              {subscription.subscription_status.replace('_', ' ')}
            </div>
          </div>
        </div>
        {subscription.cancel_at_period_end && (
          <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <span className="text-red-400 text-sm">Cancelling</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {subscription.current_period_end && (
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {subscription.cancel_at_period_end ? 'Ends' : 'Renews'} on {formatDate(subscription.current_period_end)}
            </span>
          </div>
        )}

        {subscription.payment_method_brand && subscription.payment_method_last4 && (
          <div className="flex items-center gap-2 text-gray-400">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">
              {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionStatus;