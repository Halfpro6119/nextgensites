import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { createCheckoutSession } from '../lib/stripe';
import { ensureAuthenticated } from '../lib/auth';
import { STRIPE_PRODUCTS } from '../stripe-config';

interface Package {
  id: string;
  title: string;
  icon: React.ElementType;
  price: string;
  audience: string;
  hook: string;
  features: string[];
  buttonText: string;
}

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = useFormContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get selected package from location state or form data
  const selectedPackage = location.state?.selectedPackage as Package || formData.selectedPackage;
  
  // Find the corresponding Stripe product
  const stripeProduct = selectedPackage ? 
    STRIPE_PRODUCTS.find(p => p.name === selectedPackage.title) : null;

  useEffect(() => {
    // Auto-redirect to Stripe Checkout if we have a valid package
    if (stripeProduct && !isProcessing) {
      handleCheckout();
    }
  }, [stripeProduct]);

  const handleCheckout = async () => {
    if (!stripeProduct) {
      setError('Invalid package selection');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Ensure user is authenticated before checkout
      await ensureAuthenticated();
      
      await createCheckoutSession(stripeProduct.priceId, stripeProduct.mode);
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  if (!selectedPackage || !stripeProduct) {
    return <Navigate to="/skip-call" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-purple-400"></div>
          <div className="w-3 h-3 rounded-full bg-purple-400"></div>
          <div className="w-3 h-3 rounded-full bg-purple-400"></div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-center">
            <p className="font-medium mb-2">Payment Error</p>
            <p>{error}</p>
            <button
              onClick={() => navigate('/skip-call')}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              Go Back to Packages
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedPackage.title}</h3>
                  <p className="text-gray-400 mb-4">{stripeProduct.description}</p>
                  <div className="text-2xl font-bold text-purple-400 mb-6">
                    {stripeProduct.price}
                  </div>
                </div>

                {selectedPackage.features && selectedPackage.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Today's Bonus */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
                <h3 className="text-white font-medium mb-2">🎁 Today's Bonus:</h3>
                <p className="text-gray-300">
                  Free homepage mockup within 48 hours—before we start the full project!
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-5 h-5" />
                <span>Secure, encrypted payment</span>
              </div>
            </div>
          </div>

          {/* Payment Processing */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Secure Checkout</h2>
            
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
                <h3 className="text-xl font-bold text-white">Redirecting to Secure Payment</h3>
                <p className="text-gray-400 text-center">
                  Please wait while we redirect you to Stripe's secure checkout page...
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                  <div className="bg-purple-400 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-6 text-center">
                  <h3 className="text-lg font-medium text-white mb-2">Ready to Get Started?</h3>
                  <p className="text-gray-400 mb-4">
                    Click below to proceed to our secure payment processor
                  </p>
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                      hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold text-white
                      transition-all duration-300 transform hover:scale-105 disabled:opacity-50
                      shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                </div>

                <div className="text-center text-sm text-gray-400">
                  <p className="mb-2">🔒 Your payment is secured by Stripe</p>
                  <p>We accept all major credit cards</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8">
          <button
            onClick={() => navigate(-1)}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-700 
              hover:border-purple-500 text-gray-300 hover:text-purple-400 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Packages
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;