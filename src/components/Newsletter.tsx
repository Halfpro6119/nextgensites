import React, { useState } from 'react';
import { CheckCircle, Sparkles, Zap, TrendingUp, Lock, Rocket, Brain, Target } from 'lucide-react';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useFormContext } from '../context/FormContext';

const benefits = [
  {
    icon: Brain,
    text: "Weekly AI Mastery – Exclusive strategies used by 7-figure businesses to automate and scale"
  },
  {
    icon: Target,
    text: "ROI-Focused Insights – Real case studies showing 300%+ growth with AI implementation"
  },
  {
    icon: Rocket,
    text: "Early Access & VIP Offers – Get priority access to new AI tools at subscriber-only prices"
  }
];

const socialProof = "Join 1,000+ forward-thinking business owners already leveraging our AI insights";

function Newsletter() {
  const { formData, isLoaded } = useFormContext();
  const { saveField } = useFormPersistence({ formName: 'newsletter' });
  const [email, setEmail] = useState(formData.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update email when formData changes (on load)
  React.useEffect(() => {
    if (isLoaded && formData.email) {
      setEmail(formData.email);
    }
  }, [formData.email, isLoaded]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    saveField('email', value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail('');
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl" />
      
      <div className="relative bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-3xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
              🔥 Limited Time: Get Our AI Implementation Playbook Free
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              Master AI Automation: Stay Years Ahead of Your Competition
            </h2>
            <p className="text-xl text-gray-300">
              Get weekly insider access to proven AI strategies that are generating 
              millions in revenue for businesses just like yours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
              >
                <benefit.icon className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <p className="text-gray-300">{benefit.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-purple-400 font-medium">{socialProof}</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter your email for instant access"
                className="flex-1 px-6 py-4 rounded-xl bg-gray-900/50 border border-gray-700 
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-8 py-4 rounded-xl font-semibold
                  bg-gradient-to-r from-blue-600 to-purple-600
                  hover:from-blue-500 hover:to-purple-500
                  text-white transition-all duration-300
                  transform hover:scale-105 disabled:opacity-50
                  shadow-[0_0_20px_rgba(79,70,229,0.4)]
                  hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]
                  whitespace-nowrap
                `}
              >
                {isSubmitting ? 'Subscribing...' : 'Get Instant Access'}
              </button>
            </div>

            {isSuccess && (
              <div className="flex items-center justify-center gap-2 text-green-400 animate-fade-in">
                <CheckCircle className="w-5 h-5" />
                <span>Welcome to the future of business! Check your inbox.</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>No fluff, no spam—just actionable AI strategies. Unsubscribe anytime.</span>
            </div>
          </form>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            {[
              "Weekly AI Updates",
              "Implementation Guides",
              "Expert Interviews",
              "Exclusive Tools & Resources"
            ].map((item, index) => (
              <div key={index} className="px-3 py-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsletter;