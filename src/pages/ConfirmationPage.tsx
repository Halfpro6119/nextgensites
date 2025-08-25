import React from 'react';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';

function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-400 mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Thank You for Your Trust!
          </h1>
          <p className="text-xl text-gray-300">
            I'm excited to create an amazing website that will help grow your business.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">What Happens Next?</h2>
          
          <div className="space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-medium">1</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Schedule Your Kickoff Call</h3>
                <p className="text-gray-400 mb-3">
                  Choose a time for our strategy session where we'll dive deep into your vision.
                </p>
                <button
                  onClick={() => {
                    // TODO: Open Calendly
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Now
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-medium">2</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Homepage Mockup</h3>
                <p className="text-gray-400">
                  Within 48 hours, you'll receive your custom homepage design for review.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-medium">3</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Full Website Development</h3>
                <p className="text-gray-400">
                  After your approval, we'll begin building your complete website with all features and automations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Message */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8 text-left">
          <h2 className="text-2xl font-bold text-white mb-4">A Note from Your Designer</h2>
          <p className="text-gray-300 mb-4">
            Thank you for choosing us to create your website. I personally oversee every project to ensure 
            it exceeds expectations. You've made a great decision, and I can't wait to help transform your 
            online presence.
          </p>
          <p className="text-gray-300">
            Looking forward to our kickoff call!
          </p>
          <div className="mt-4 text-purple-400 font-medium">
            - Your Name
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;