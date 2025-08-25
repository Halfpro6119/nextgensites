import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  ArrowRight, 
  MessageSquare,
  MessageCircle,
  Rocket, 
  Mail, 
  User,
  Building,
  Phone,
  Loader2,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { getBusinessData, submitNextStepsQuestion, BusinessData } from '../lib/supabase';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useFormContext } from '../context/FormContext';
import { useAuth } from '../components/AuthProvider';
import { signUpUser, signInUser } from '../lib/auth';
import { createOrUpdateUserProfile } from '../lib/userData';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How much will my website cost?",
    answer: "Our website packages start from £395 for a professional single-page site, up to £1,495 for a complete brand transformation with advanced features. We also offer monthly care plans starting at £49/month to keep your site maintained and growing."
  },
  {
    question: "How long does it take to build my website?",
    answer: "Most websites are delivered within 3-7 business days. Our Starter Boost package can be completed in 3-5 days, while more complex projects like our Authority Pro package typically take 5-7 days including revisions."
  },
  {
    question: "What if I don't like the design?",
    answer: "We offer unlimited revisions until you're 100% satisfied. Our process includes a custom homepage preview within 48 hours, so you can see and approve the direction before we build the full site."
  },
  {
    question: "Do you provide hosting and maintenance?",
    answer: "Yes! All our packages include hosting setup, and we offer Care Plans starting at £49/month that include hosting, security monitoring, backups, and ongoing maintenance."
  },
  {
    question: "Can you help with SEO and getting found on Google?",
    answer: "Absolutely! All our websites are built with SEO best practices, including proper meta tags, fast loading speeds, and mobile optimization. Our Growth Plan includes monthly SEO tune-ups to improve your rankings."
  },
  {
    question: "What happens after my website is live?",
    answer: "You'll receive training on how to update your content, access to analytics, and 30 days of free support. You can also add a Care Plan for ongoing maintenance and growth."
  },
  {
    question: "Do I own my website?",
    answer: "Yes! Unlike subscription-based website builders, you own your website completely. We'll provide you with all the files and can transfer everything to your preferred hosting if needed."
  },
  {
    question: "Can you integrate with my existing tools?",
    answer: "Yes, we can integrate with most popular tools including Google Analytics, Mailchimp, CRM systems, booking platforms, and payment processors like Stripe or PayPal."
  }
];

function FAQSection({ onMoveForward, onStillHaveQuestion }: { 
  onMoveForward: () => void; 
  onStillHaveQuestion: () => void; 
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <p className="text-xl text-gray-300">
          Let's see if we can answer your question right away!
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-700 last:border-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-purple-400 transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
                }`}
              >
                <p className="text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Did that answer your question?</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onMoveForward}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-green-700 
              hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105
              text-white font-semibold text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)]
              hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Yes, I'm Ready to Move Forward
          </button>
          <button
            onClick={onStillHaveQuestion}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 
              hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105
              text-white font-semibold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)]
              hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            I Still Have a Question
          </button>
        </div>
      </div>
    </div>
  );
}

function NextStepsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isLoaded } = useFormContext();
  const { user, loading: authLoading } = useAuth();
  const { saveField } = useFormPersistence({ formName: 'nextSteps' });
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState<'options' | 'faq' | 'question'>('options');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticationAttempted, setAuthenticationAttempted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    question: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Auto-authenticate user based on business data
  useEffect(() => {
    const autoAuthenticate = async () => {
      // Skip if already authenticated, still loading, no business data, or already attempted
      if (user || authLoading || !businessData || authenticationAttempted) return;
      
      console.log('Starting auto-authentication for:', businessData.business_name);
      
            
            // Pre-fill form with business data
            setFormData(prev => ({
              ...prev,
              name: businessData.contact_name || '',
              email: businessData.contact_email || '',
              company: businessData.business_name || ''
            }));
        
        // Pre-fill form regardless of authentication success
        setFormData(prev => ({
          ...prev,
          name: businessData.contact_name || '',
          email: businessData.contact_email || '',
          company: businessData.business_name || ''
        }));
    };

    autoAuthenticate();
  }, [user, authLoading, businessData, authenticationAttempted]);

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      const data = await getBusinessData(slug);
      if (!data) {
        navigate('/');
        return;
      }
      setBusinessData(data);
      
      // Pre-fill form with business data
      if (!authenticationAttempted) {
        setFormData(prev => ({
          ...prev,
          name: data.contact_name || '',
          email: data.contact_email || '',
          company: data.business_name || ''
        }));
      }
      
      setLoading(false);

      // Set page title
      document.title = `Next Steps | ${data.business_name}`;
    };

    fetchData();
  }, [slug, navigate]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    saveField(fieldName, value);
  };

  const handleMoveForward = () => {
    if (!businessData) return;
    
    // Navigate directly to package selection
    navigate('/skip-call');
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    
    setIsSubmitting(true);

    try {
      // Submit the question (works for both authenticated and anonymous users)
      const result = await submitNextStepsQuestion(slug, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        question: formData.question,
        priority: formData.priority
      });

      if (result === true) {
        setIsSubmitted(true);
        setShowQuestionForm(false);
        console.log('Successfully submitted question');
        
        // Try to create user profile if authenticated (optional)
        if (user && businessData) {
          try {
            await createOrUpdateUserProfile(user, {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: formData.company || businessData.business_name,
              website: businessData.website
            });
            console.log('Updated user profile after question submission');
          } catch (profileError) {
            console.log('Could not update user profile, but question was submitted successfully:', profileError);
          }
        }
      } else {
        console.log('Question submission failed');
        alert('Error submitting question. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Error submitting question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!businessData) {
    return null;
  }

  // Show authentication status
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Preparing Your Experience</h2>
            <p className="text-gray-300">
              We're setting up your personalized experience for {businessData?.business_name}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Question Submitted!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for your question. We'll get back to you within 24 hours with a detailed response.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105
                text-white font-semibold text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)]
                hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
            Ready to Take the Next Step?
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Hi {businessData.contact_name.split(' ')[0]}, let's get {businessData.business_name} the website it deserves. 
            Choose how you'd like to proceed:
          </p>
          
          {/* Authentication Status Indicator */}
          {user && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20 mb-4">
              <CheckCircle className="w-4 h-4" />
              ✅ Authenticated as {businessData.business_name}
            </div>
          )}
          
          {!user && authenticationAttempted && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20 mb-4">
              <MessageCircle className="w-4 h-4" />
              Ready to submit questions for {businessData.business_name}
            </div>
          )}
        </div>

        {!showQuestionForm ? (
          <>
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveSection('options')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeSection === 'options'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Get Started
              </button>
              <button
                onClick={() => setActiveSection('faq')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeSection === 'faq'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveSection('question')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeSection === 'question'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Ask a Question
              </button>
            </div>

            {/* Content Sections */}
            {activeSection === 'options' && (
              <div className="text-center">
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8 max-w-2xl mx-auto text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Rocket className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    Perfect! Let's get you set up with the perfect website package for {businessData.business_name}.
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={handleMoveForward}
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-green-700 
                        hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105
                        text-white font-semibold text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)]
                        hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] flex items-center justify-center gap-2"
                    >
                      View Website Packages
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                      <HelpCircle className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">I Have Questions First</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      Check out our FAQ section for quick answers to common questions about pricing, 
                      timelines, and our process.
                    </p>
                    <button
                      onClick={() => setActiveSection('faq')}
                      className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 
                        hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105
                        text-white font-semibold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)]
                        hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2"
                    >
                      Browse FAQ
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/10">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                      <MessageSquare className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Ask a Custom Question</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      Have a specific question about your project? We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setActiveSection('question')}
                      className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 
                        hover:from-purple-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105
                        text-white font-semibold text-lg shadow-[0_0_20px_rgba(147,51,234,0.4)]
                        hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] flex items-center justify-center gap-2"
                    >
                      Ask Question
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'faq' && (
              <FAQSection 
                onMoveForward={handleMoveForward}
                onStillHaveQuestion={() => setActiveSection('question')}
              />
            )}

            {activeSection === 'question' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">Ask Your Question</h2>
                    <p className="text-xl text-gray-300">
                      We'll get back to you within 24 hours with a detailed response.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitQuestion} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Your name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                          Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                          Company
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Your company"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                        Priority Level
                      </label>
                      <select
                        id="priority"
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="medium">Medium - Planning for future</option>
                        <option value="high">High - Ready to start soon</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">
                        Your Question *
                      </label>
                      <textarea
                        id="question"
                        value={formData.question}
                        onChange={(e) => handleInputChange('question', e.target.value)}
                        required
                        rows={5}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="What would you like to know about our services, pricing, timeline, or anything else?"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setActiveSection('options')}
                        className="flex-1 px-6 py-3 rounded-full border-2 border-gray-700 hover:border-purple-500 
                          text-gray-300 hover:text-purple-400 transition-all duration-300"
                      >
                        Back to Options
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 
                          hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105
                          text-white font-semibold shadow-[0_0_20px_rgba(79,70,229,0.4)]
                          hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] disabled:opacity-50 disabled:cursor-not-allowed
                          flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Question
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Authentication Notice */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-sm text-center">
                    🔒 Your question will be securely saved{user ? ' to your account' : ` for ${businessData.business_name}`}
                  </p>
                </div>
              </div>
            )}

            {/* Trust Section */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8 text-center mt-16">
              <h3 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">7 Days</div>
                  <p className="text-gray-300">Average delivery time</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                  <p className="text-gray-300">Satisfaction guarantee</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                  <p className="text-gray-300">Happy clients</p>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Footer */}
        <div className="mt-24 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />
          <p className="text-gray-400 mb-4">
            Questions? Need help? We're here for you.
          </p>
          <a 
            href="mailto:riley@nextgensites.net" 
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            riley@nextgensites.net
          </a>
        </div>
      </div>
    </div>
  );
}

export default NextStepsPage;