import React, { useState } from 'react';
import { CheckCircle, Zap, Target, Shield, Clock, ArrowRight, Phone, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useAuth } from '../components/AuthProvider';
import { saveConsultationData, trackFormActivity } from '../lib/userData';
import SignInModal from '../components/SignInModal';

function ConsultationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { formData, updateFormData, isLoaded } = useFormContext();
  const { saveField } = useFormPersistence({ formName: 'consultation' });
  const { user } = useAuth();

  // Get prefilled data from navigation state
  const prefilledData = location.state || {};

  const handleInputChange = (fieldName: string, value: string) => {
    saveField(fieldName, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formDataObj = new FormData(form);
    const data = Object.fromEntries(formDataObj.entries());

    try {
      // Track form activity
      if (user) {
        await trackFormActivity(user, 'consultation', 'completed');
        
        // Save to database if user is authenticated
        await saveConsultationData(user, {
          name: data.name as string,
          email: data.email as string,
          phone: data.phone as string,
          company: data.company as string,
          website: data.website as string,
          question: data.question as string,
          automations: data.automations as string,
          source: data.source as string
        });
      }
      
      updateFormData(data);
      navigate('/onboarding');
    } catch (error) {
      console.error('Form submission error:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'There was an error submitting your form. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormStart = async () => {
    if (user) {
      await trackFormActivity(user, 'consultation', 'started');
    }
  };

  // Show loading state while form data is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-2xl mx-auto">
        {/* Authentication Notice */}
        {!user && (
          <div className="mb-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-bold text-blue-400 mb-2">💡 Save Your Progress</h3>
            <p className="text-gray-300 mb-4">
              Sign in to automatically save your form data and track your journey with us.
            </p>
            <button
              onClick={() => setShowSignInModal(true)}
              className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-full text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign In to Save Progress
            </button>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Would you like to know what we can do for you?
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Fill out the form below, and we'll contact you within 48 hours for a free analysis.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No costs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No obligations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No annoying sales pitch</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} onFocus={handleFormStart} className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 space-y-6">
            {/* Required Fields */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                defaultValue={formData.name || prefilledData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-purple-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                defaultValue={formData.email || prefilledData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">
                Your Most Important Question <span className="text-purple-400">*</span>
              </label>
              <textarea
                name="question"
                id="question"
                required
                defaultValue={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                rows={3}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="What's your biggest challenge with your website?"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                defaultValue={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Your phone number"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                id="company"
                defaultValue={formData.company || prefilledData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
                Current Website
              </label>
              <input
                type="url"
                name="website"
                id="website"
                defaultValue={formData.website || prefilledData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-300 mb-2">
                How Did You Find Us?
              </label>
              <select
                name="source"
                id="source"
                defaultValue={formData.source || prefilledData.source || ''}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Please select</option>
                <option value="Google">Google</option>
                <option value="Social Media">Social Media</option>
                <option value="Email">Email</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="automations" className="block text-sm font-medium text-gray-300 mb-2">
                What Automations Are You Currently Using?
              </label>
              <textarea
                name="automations"
                id="automations"
                defaultValue={formData.automations}
                onChange={(e) => handleInputChange('automations', e.target.value)}
                rows={3}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="List any tools or automations you're currently using..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full px-8 py-4 rounded-full
              bg-gradient-to-r from-blue-600 to-purple-600
              hover:from-blue-500 hover:to-purple-500
              transition-all duration-300
              text-white font-semibold text-lg
              shadow-[0_0_20px_rgba(79,70,229,0.4)]
              hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]
              disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-105
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Request My Free Web Design Strategy'}
          </button>
        </form>

        {/* Sign In Modal */}
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSuccess={() => {
            setShowSignInModal(false);
            // Optionally refresh the page or update state
          }}
        />
      </div>
    </div>
  );
}

export default ConsultationPage;