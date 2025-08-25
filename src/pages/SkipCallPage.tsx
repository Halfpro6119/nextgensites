import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, Loader2, Shield, Star, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STRIPE_PRODUCTS, CARE_PLANS } from '../stripe-config';
import { createCheckoutSession } from '../lib/stripe';

interface PackageCardProps {
  product: typeof STRIPE_PRODUCTS[0] | typeof CARE_PLANS[0];
  isPopular?: boolean;
  isAddon?: boolean;
  onSelect?: (product: any, addonProduct?: any) => void;
  selectedOneTimeProduct?: typeof STRIPE_PRODUCTS[0] | null;
}

function PackageCard({ product, isPopular = false, isAddon = false, onSelect, selectedOneTimeProduct }: PackageCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPackage = async () => {
    try {
      setIsLoading(true);
      
      if (onSelect) {
        if (isAddon && selectedOneTimeProduct) {
          // This is an addon being selected with a one-time product
          onSelect(selectedOneTimeProduct, product);
        } else {
          // This is a one-time product being selected
          onSelect(product);
        }
      } else {
        // Fallback to direct checkout for one-time products
        await createCheckoutSession(product.priceId, product.mode);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}. Please try again.`);
      setIsLoading(false);
    }
  };

  const buttonContent = isLoading ? (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      Processing...
    </div>
  ) : (
    isAddon ? 'Add to Package' : 'Get Started'
  );

  return (
    <div className={`relative bg-gray-800/50 backdrop-blur-lg border rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 ${
      isPopular ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' : 
      isAddon ? 'border-blue-500/30 bg-blue-500/5' : 'border-gray-700'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      
      {isAddon && (
        <div className="absolute -top-3 left-4">
          <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-xs font-medium">
            Add-on Plan
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{product.emoji}</span>
        <h3 className="text-xl font-bold text-white">{product.name}</h3>
      </div>
      <p className="text-gray-400 mb-4">{product.description}</p>
      <div className="mb-6">
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          {product.price}
        </span>
      </div>
      
      {/* Features list */}
      <div className="mb-6 space-y-2 max-h-48 overflow-y-auto">
        {product.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      {'bestFor' in product && (
        <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
          <div className="text-purple-400 text-sm font-medium mb-1">🧠 Best for:</div>
          <div className="text-gray-300 text-sm">{product.bestFor}</div>
        </div>
      )}
      
      {'pitch' in product && (
        <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="text-blue-400 text-sm font-medium mb-1">💡 Pitch:</div>
          <div className="text-gray-300 text-sm italic">"{product.pitch}"</div>
        </div>
      )}
      
      <button
        onClick={handleSelectPackage}
        disabled={isLoading}
        className={`block w-full px-6 py-3 rounded-full font-semibold text-center
          transition-all duration-300 transform hover:scale-105 disabled:opacity-50
          ${isAddon 
            ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]'
          }
          hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-center
        `}
      >
        {buttonContent}
      </button>
    </div>
  );
}

function SkipCallPage() {
  const navigate = useNavigate();
  const [selectedOneTimeProduct, setSelectedOneTimeProduct] = useState<typeof STRIPE_PRODUCTS[0] | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleProductSelect = async (product: any, addonProduct?: any) => {
    try {
      if (addonProduct) {
        // Create checkout session with both one-time and subscription
        await createCheckoutSession(product.priceId, 'subscription', addonProduct.priceId);
      } else {
        // Create checkout session with just the one-time product
        await createCheckoutSession(product.priceId, product.mode);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error processing checkout. Please try again.');
    }
  };

  const handleOneTimeProductSelect = (product: typeof STRIPE_PRODUCTS[0]) => {
    setSelectedOneTimeProduct(product);
  };

  const handleNoThanks = () => {
    if (selectedOneTimeProduct) {
      handleProductSelect(selectedOneTimeProduct);
    }
  };

  const handleBackToPackages = () => {
    setSelectedOneTimeProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-7xl mx-auto">
        {!selectedOneTimeProduct ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                Choose Your Perfect Website Package
              </h1>
              <p className="text-2xl text-gray-300 mb-4">
                One-time payment. No monthly fees. Own your website forever.
              </p>
            </div>

            {/* Main Website Packages */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {STRIPE_PRODUCTS.map((product) => (
                <PackageCard 
                  key={product.id} 
                  product={product} 
                  isPopular={product.name === 'Growth Engine'}
                  onSelect={handleOneTimeProductSelect}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                Perfect Choice! Add a Monthly Care Plan?
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                You've selected <strong className="text-white">{selectedOneTimeProduct.name}</strong>. 
                Add a monthly care plan to keep your site growing and performing at its best.
              </p>
              
              {/* Selected Package Summary */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Selected: {selectedOneTimeProduct.name}</h3>
                </div>
                <p className="text-gray-300 mb-2">{selectedOneTimeProduct.description}</p>
                <div className="text-2xl font-bold text-green-400">{selectedOneTimeProduct.price}</div>
              </div>
            </div>

            {/* Care Plans Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  💸 Add a Monthly Care Plan
                </h2>
                <p className="text-xl text-gray-300">
                  Keep your site growing and performing at its best
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {CARE_PLANS.map((plan) => (
                  <PackageCard 
                    key={plan.id} 
                    product={plan} 
                    isAddon={true}
                    onSelect={handleProductSelect}
                    selectedOneTimeProduct={selectedOneTimeProduct}
                  />
                ))}
              </div>
              
              {/* No Thanks and Back Options */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleNoThanks}
                  className="px-8 py-4 rounded-full bg-gray-700 hover:bg-gray-600 
                    text-gray-300 hover:text-white transition-all duration-300 font-semibold"
                >
                  No Thanks, Just the Website
                </button>
                <button
                  onClick={handleBackToPackages}
                  className="px-6 py-3 rounded-full border-2 border-gray-700 hover:border-purple-500 
                    text-gray-300 hover:text-purple-400 transition-all duration-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Website Packages
                </button>
              </div>
            </div>
          </>
        )}

        <p className="text-center text-gray-400 mb-4">
          All website packages include our 30-day satisfaction guarantee
        </p>
        
        {/* Trust indicators */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
            <span className="text-gray-300 ml-2">4.9/5 from 100+ clients</span>
          </div>
          <p className="text-gray-400">
            Join hundreds of businesses that have transformed their online presence
          </p>
        </div>

        <div className="text-center mt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure checkout powered by Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Own your website forever</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkipCallPage;