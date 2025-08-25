import React, { useEffect, useState } from 'react';
import { CheckCircle, Calendar, ArrowRight, Star, Zap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: subscription } = await supabase
            .from('stripe_user_subscriptions')
            .select('*')
            .single();
          
          setSubscriptionData(subscription);
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const openCalendly = () => {
    // Replace with your actual Calendly link
    window.open('https://calendly.com/your-calendly-link', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-4xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 text-green-400 mb-8 animate-bounce">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400 mb-6">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Welcome to the future of your business growth!
          </p>
          {subscriptionData && (
            <div className="inline-block px-6 py-3 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-purple-400 font-medium">
                Active Plan: {subscriptionData.price_id === 'price_1REBaYHXLiaHMkNqjYxHxR7J' ? 'Starter Website' :
                             subscriptionData.price_id === 'price_1REBb0HXLiaHMkNqWecx8tz0' ? 'Full Website' :
                             subscriptionData.price_id === 'price_1RVcWzHXLiaHMkNqlr20ziNO' ? 'Growth System' : 'Unknown'}
              </span>
            </div>
          )}
        </div>

        {/* What Happens Next */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">What Happens Next?</h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Project Initiation</h3>
                <p className="text-gray-400 mb-4">
                  We'll review your requirements and begin planning your custom website design and development.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Receive Your Custom Design</h3>
                <p className="text-gray-400">
                  Within 48 hours, you'll receive your custom homepage design mockup for review and feedback.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Website Development & Launch</h3>
                <p className="text-gray-400">
                  After your design approval, we'll build your complete website with all features, automations, and optimizations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Section */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 text-purple-400 mb-4">
            <Zap className="w-6 h-6" />
            <span className="font-bold text-lg">Exclusive Subscriber Bonus</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Free Homepage Preview in 48 Hours
          </h3>
          <p className="text-gray-300 mb-6">
            As a thank you for your trust, we'll create a custom homepage mockup for your review. This helps us understand your preferences and gets you results faster.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Custom Design Preview</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Brand-Aligned Colors</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Mobile-Optimized Layout</span>
            </div>
          </div>
        </div>

        {/* Personal Message */}
        <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">A Personal Message</h3>
          <p className="text-gray-300 mb-4 leading-relaxed">
            Thank you for choosing us to transform your online presence. I personally oversee every project to ensure 
            it not only meets but exceeds your expectations. You've made an excellent decision, and I'm excited to help 
            you achieve remarkable growth.
            -Riley
          </p>
        </div>

        {/* Social Proof */}
        <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg italic text-gray-300 mb-4">
              "The team delivered exactly what they promised. Our new website has increased our leads by 300% 
              and looks absolutely stunning. Best investment we've made for our business."
            </blockquote>
            <div className="text-purple-400 font-medium">
              — Sarah M., Marketing Agency Owner
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 
              hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105
              text-white font-semibold text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)]
              hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]
              flex items-center justify-center gap-2"
          >
            Back to Homepage
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Support Information */}
        <div className="mt-12 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6" />
          <p className="text-gray-400 mb-2">
            Questions? Need help? We're here for you.
          </p>
          <a 
            href="mailto:support@yourcompany.com" 
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Riley@nextgensites.net
          </a>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;