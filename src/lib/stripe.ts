import { STRIPE_PRODUCTS, CARE_PLANS } from '../stripe-config';
import { ensureAuthenticated } from './auth';

export async function createCheckoutSession(priceId: string, mode: 'subscription' | 'payment', addonPriceId?: string) {
  // Search in both STRIPE_PRODUCTS and CARE_PLANS
  const allProducts = [...STRIPE_PRODUCTS, ...CARE_PLANS];
  const product = allProducts.find(p => p.priceId === priceId);

  if (!product) {
    throw new Error('Invalid product selected');
  }

  try {
    // Create anonymous checkout session
    const requestBody: any = {
      price_id: priceId,
      mode: addonPriceId ? 'subscription' : mode,
      success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/skip-call`,
    };

    if (addonPriceId) {
      requestBody.addon_price_id = addonPriceId;
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to create checkout session`);
    }

    const data = await response.json();
    
    if (!data.url) {
      throw new Error('No checkout URL returned from server');
    }

    // Redirect to Stripe Checkout
    window.location.href = data.url;
    
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred during checkout');
  }
}

export function formatPrice(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}