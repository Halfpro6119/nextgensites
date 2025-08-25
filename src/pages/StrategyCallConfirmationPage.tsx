import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight, CheckCircle, Zap } from 'lucide-react';

function StrategyCallConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 animate-fade-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Your AI Strategy Call is Confirmed!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Check your email for the calendar invite and call details.
          </p>
        </div>

        {/* Fast Action Bonus */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-3 text-purple-400 mb-4">
            <Zap className="w-6 h-6" />
            <span className="font-semibold">Today Only: Fast-Action Bonus</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Get Your Free Homepage Preview in 48 Hours
          </h2>
          <p className="text-gray-300 mb-6">
            Complete our quick onboarding form now, and our design team will create a custom homepage 
            mockup for your review—before we even have our strategy call. This helps us make the most 
            of our consultation and gets you results faster.
          </p>
          <div className="flex items-start gap-3 text-gray-300 mb-6">
            <Rocket className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <p>
              Most clients who complete onboarding before the call see their websites go live up to 
              73% faster. Let's accelerate your success!
            </p>
          </div>
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 
              hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105
              text-white font-semibold text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)]
              hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2"
          >
            Start Fast-Track Onboarding
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">What Happens Next?</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-medium">1</span>
              </div>
              <div>
                <p className="text-white font-medium">Complete Quick Onboarding</p>
                <p className="text-gray-400">Help us understand your vision (5 mins)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-medium">2</span>
              </div>
              <div>
                <p className="text-white font-medium">Receive Homepage Preview</p>
                <p className="text-gray-400">Get your custom design within 48 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-medium">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Strategy Call</p>
                <p className="text-gray-400">Deep dive into your AI automation plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrategyCallConfirmationPage;