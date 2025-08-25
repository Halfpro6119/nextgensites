import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Upload, Rocket, CheckCircle, ArrowLeft } from 'lucide-react';
import { useFormContext } from '../context/FormContext';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useAuth } from '../components/AuthProvider';
import { saveOnboardingData, trackFormActivity } from '../lib/userData';
import { useSearchParams } from 'react-router-dom';
import { getOutreachData, getBusinessData } from '../lib/supabase';

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/7j4c4vkifnsan7yjmz8b16l5yjakt54v';

function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { formData, updateFormData, isLoaded } = useFormContext();
  const { saveField } = useFormPersistence({ formName: 'onboarding' });
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(formData.goals || []);
  const [showOtherGoal, setShowOtherGoal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Get slug from URL params
  const slugFromUrl = searchParams.get('slug');
  
  // Get prefilled data from navigation state
  const [prefilledData, setPrefilledData] = useState(location.state || {});

  // Fetch additional data if slug is provided
  React.useEffect(() => {
    const fetchSlugData = async () => {
      if (slugFromUrl) {
        // Try to get business data first, fallback to outreach data
        let businessData = await getBusinessData(slugFromUrl);
        let outreachData = null;
        
        if (!businessData) {
          outreachData = await getOutreachData(slugFromUrl);
        }
        
        const dataSource = businessData || outreachData;
        
        if (dataSource) {
          setPrefilledData(prev => ({
            ...prev,
            businessName: businessData ? businessData.business_name : dataSource['account name'],
            businessWebsite: businessData ? businessData.website : dataSource['account website'],
            contactName: businessData ? businessData.contact_name : dataSource['contact name'],
            contactEmail: businessData ? businessData.contact_email : dataSource['contact email'],
            industry: dataSource.industry,
            source: 'Next Steps Page'
          }));
        }
      }
    };

    fetchSlugData();
  }, [slugFromUrl]);

  // Update selectedGoals when formData.goals changes (on load)
  React.useEffect(() => {
    if (isLoaded && formData.goals) {
      setSelectedGoals(formData.goals);
    }
  }, [formData.goals, isLoaded]);

  // Update showOtherGoal when goals change
  React.useEffect(() => {
    setShowOtherGoal(selectedGoals.includes('Something else'));
  }, [selectedGoals]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setUploadProgress(`${files.length} file(s) selected`);
  };

  const sendToMake = async (data: any) => {
    try {
      const formDataToSend = new FormData();

      // Add all text data
      const dataToSend = {
        name: formData.name || '',
        email: formData.email || '',
        question: formData.question || '',
        businessName: data.businessName || '',
        phone: formData.phone || '',
        source: formData.source || '',
        currentWebsite: data.currentWebsite || '',
        automations: formData.automations || '',
        about: data.businessDescription || '',
        goals: selectedGoals,
        style: data.designStyle || '',
        inspiration: data.inspirationSites || '',
        pages: data.desiredPages || '',
        avoid: data.avoidFeatures || '',
        budget: data.budget || '',
        extra: data.additionalInfo || ''
      };

      // Add each field to FormData
      Object.entries(dataToSend).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Add only the file data for each image
      selectedFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        body: formDataToSend,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Make webhook error: ${errorData}`);
      }

      const responseText = await response.text();
      if (responseText.toLowerCase() !== 'accepted') {
        throw new Error('Unexpected response from Make.com');
      }
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request to Make.com timed out. Please try again.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred with Make.com.');
    }
  };

  const handleGoalChange = (goal: string) => {
    let newGoals;
    if (goal === 'Something else') {
      setShowOtherGoal(!showOtherGoal);
      if (selectedGoals.includes(goal)) {
        newGoals = selectedGoals.filter(g => g !== goal);
      } else {
        newGoals = [...selectedGoals, goal];
      }
    } else {
      if (selectedGoals.includes(goal)) {
        newGoals = selectedGoals.filter(g => g !== goal);
      } else {
        newGoals = [...selectedGoals, goal];
      }
    }
    setSelectedGoals(newGoals);
    saveField('goals', newGoals);
  };

  const handleInputChange = (fieldName: string, value: string) => {
    saveField(fieldName, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formDataObj = new FormData(form);
    const data = Object.fromEntries(formDataObj.entries());

    try {
      // Track form completion
      if (user) {
        await trackFormActivity(user, 'onboarding', 'completed');
        
        // Save to database if user is authenticated
        await saveOnboardingData(user, {
          business_name: data.businessName as string,
          business_description: data.businessDescription as string,
          goals: selectedGoals,
          other_goal: data.otherGoal as string,
          design_style: data.designStyle as string,
          current_website: data.currentWebsite as string,
          inspiration_sites: data.inspirationSites as string,
          desired_pages: data.desiredPages as string,
          avoid_features: data.avoidFeatures as string,
          budget: data.budget as string,
          additional_info: data.additionalInfo as string,
          assets_uploaded: selectedFiles.length > 0
        });
      }
      
      await sendToMake(data);
      updateFormData({
        ...data,
        goals: selectedGoals
      });
      
      navigate('/skip-call');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setUploadProgress('Error uploading files. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormStart = async () => {
    if (user) {
      await trackFormActivity(user, 'onboarding', 'started');
    }
  };

  // Show loading state while form data is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Let's Build Your Dream Site — Just a Few Quick Questions
          </h1>
          <p className="text-xl text-gray-300">
            This helps us hit the ground running with ideas tailored to your goals.
            You can be as detailed or as simple as you like — we'll take it from here.
          </p>
        </div>

        <form onSubmit={handleSubmit} onFocus={handleFormStart} className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 space-y-8">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-lg font-medium text-white mb-2">
                What's the name of your business or brand?
              </label>
              <p className="text-gray-400 text-sm mb-3">This is what we'll build your presence around.</p>
              <input
                type="text"
                name="businessName"
                id="businessName"
                required
                defaultValue={formData.businessName || prefilledData.businessName || ''}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your business name"
              />
            </div>

            {/* Business Description */}
            <div>
              <label htmlFor="businessDescription" className="block text-lg font-medium text-white mb-2">
                Tell us a bit about your business.
              </label>
              <p className="text-gray-400 text-sm mb-3">What do you do, who do you serve, and what makes you different?</p>
              <textarea
                name="businessDescription"
                id="businessDescription"
                required
                defaultValue={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                rows={4}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Tell us about your business..."
              />
            </div>

            {/* Website Goals */}
            <div>
              <label className="block text-lg font-medium text-white mb-2">
                What's the main goal of your new website?
              </label>
              <p className="text-gray-400 text-sm mb-3">Choose one or more</p>
              <div className="space-y-3">
                {['Get more clients', 'Look more professional', 'Automate lead generation', 'Sell products or services', 'Something else'].map((goal) => (
                  <label key={goal} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="goals"
                      value={goal}
                      checked={selectedGoals.includes(goal)}
                      onChange={() => handleGoalChange(goal)}
                      className="w-5 h-5 rounded border-gray-700 bg-gray-900/50 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-gray-300">{goal}</span>
                  </label>
                ))}
                {showOtherGoal && (
                  <input
                    type="text"
                    name="otherGoal"
                    defaultValue={formData.otherGoal}
                    onChange={(e) => handleInputChange('otherGoal', e.target.value)}
                    placeholder="Tell us your specific goal"
                    className="mt-2 w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                )}
              </div>
            </div>

            {/* Design Style */}
            <div>
              <label htmlFor="designStyle" className="block text-lg font-medium text-white mb-2">
                What kind of vibe do you want the website to have?
              </label>
              <p className="text-gray-400 text-sm mb-3">Examples: Clean & modern, bold & energetic, luxurious & elegant, etc.</p>
              <textarea
                name="designStyle"
                id="designStyle"
                required
                defaultValue={formData.designStyle}
                onChange={(e) => handleInputChange('designStyle', e.target.value)}
                rows={3}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Describe your desired style..."
              />
            </div>

            {/* Current Website */}
            <div>
              <label htmlFor="currentWebsite" className="block text-lg font-medium text-white mb-2">
                Do you have a current website?
              </label>
              <p className="text-gray-400 text-sm mb-3">If yes, drop the link here so we can see where you're starting from.</p>
              <input
                type="text"
                name="currentWebsite"
                id="currentWebsite"
                defaultValue={formData.currentWebsite || prefilledData.businessWebsite || ''}
                onChange={(e) => handleInputChange('currentWebsite', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="website.com"
              />
            </div>

            {/* Inspiration Sites */}
            <div>
              <label htmlFor="inspirationSites" className="block text-lg font-medium text-white mb-2">
                Any websites you love the look of?
              </label>
              <p className="text-gray-400 text-sm mb-3">List a couple — this helps us understand your style and taste.</p>
              <textarea
                name="inspirationSites"
                id="inspirationSites"
                defaultValue={formData.inspirationSites}
                onChange={(e) => handleInputChange('inspirationSites', e.target.value)}
                rows={3}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Share some website links that inspire you..."
              />
            </div>

            {/* Desired Pages */}
            <div>
              <label htmlFor="desiredPages" className="block text-lg font-medium text-white mb-2">
                What services or pages should we include?
              </label>
              <p className="text-gray-400 text-sm mb-3">Example: Home, About, Services, Testimonials, Contact — or anything custom.</p>
              <textarea
                name="desiredPages"
                id="desiredPages"
                required
                defaultValue={formData.desiredPages}
                onChange={(e) => handleInputChange('desiredPages', e.target.value)}
                rows={3}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="List the pages you'd like..."
              />
            </div>

            {/* Features to Avoid */}
            <div>
              <label htmlFor="avoidFeatures" className="block text-lg font-medium text-white mb-2">
                Anything you definitely want to avoid?
              </label>
              <p className="text-gray-400 text-sm mb-3">Tell us what you don't like so we can steer clear.</p>
              <textarea
                name="avoidFeatures"
                id="avoidFeatures"
                defaultValue={formData.avoidFeatures}
                onChange={(e) => handleInputChange('avoidFeatures', e.target.value)}
                rows={3}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Share any features or styles you want to avoid..."
              />
            </div>

            {/* Updated File Upload Section */}
            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Upload any assets (logo, photos, brand guide, etc.)
              </label>
              <p className="text-gray-400 text-sm mb-3">Optional, but helpful!</p>
              <div 
                className={`
                  mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg
                  hover:border-purple-500/50 transition-colors relative
                  ${selectedFiles.length > 0 ? 'bg-purple-500/10' : ''}
                `}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-400">
                    <label
                      htmlFor="assets"
                      className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="assets"
                        name="assets"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, PDF up to 10MB each
                  </p>
                  {uploadProgress && (
                    <p className="text-sm text-purple-400 mt-2">
                      {uploadProgress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label htmlFor="budget" className="block text-lg font-medium text-white mb-2">
                Budget Range
              </label>
              <p className="text-gray-400 text-sm mb-3">So we can match the right package for your goals.</p>
              <select
                name="budget"
                id="budget"
                required
                defaultValue={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select your budget range</option>
                <option value="Under £2,000">Under £2,000</option>
                <option value="£2,000-£5,000">£2,000-£5,000</option>
                <option value="£5,000-£10,000">£5,000-£10,000</option>
                <option value="£10,000+">£10,000+</option>
              </select>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additionalInfo" className="block text-lg font-medium text-white mb-2">
                Anything else you want us to know?
              </label>
              <p className="text-gray-400 text-sm mb-3">Feel free to brain-dump anything that comes to mind.</p>
              <textarea
                name="additionalInfo"
                id="additionalInfo"
                defaultValue={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                rows={4}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Share any additional thoughts or requirements..."
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-700 
                hover:border-purple-500 text-gray-300 hover:text-purple-400 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105
                text-white font-semibold text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)]
                hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Processing...'
              ) : (
                <>
                  Continue to Packages
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Reassurance */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Rocket className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300">
                Once you hit submit, you'll head straight to our package selection.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300">
                We'll review everything and prepare your custom solution based on your needs.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OnboardingPage;