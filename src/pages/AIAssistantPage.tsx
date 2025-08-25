import React, { useState } from 'react';
import { MessageCircle, Zap, Target, Shield, Clock, ArrowRight, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useFormContext } from '../context/FormContext';
import axios from 'axios';

const benefits = [
  {
    icon: Clock,
    title: "Instant Support",
    description: "Get real-time answers to your questions"
  },
  {
    icon: Target,
    title: "Personalized Recommendations",
    description: "Based on your preferences and business goals"
  },
  {
    icon: Shield,
    title: "Zero Pressure",
    description: "No sales pitches—just pure, helpful guidance"
  },
  {
    icon: Zap,
    title: "Quick Setup",
    description: "Get started immediately with the perfect plan"
  }
];

const testimonials = [
  {
    quote: "I was able to get everything sorted in minutes, no human call needed! The AI really knows its stuff.",
    author: "Michael R.",
    role: "E-commerce Owner"
  },
  {
    quote: "Super impressed with how fast and accurate the AI was in helping me select my website package. Couldn't be happier with the experience!",
    author: "Sarah L.",
    role: "Marketing Consultant"
  }
];

function AIAssistantPage() {
  const { isLoaded } = useFormContext();
  const { saveField } = useFormPersistence({ formName: 'aiAssistant' });
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (fieldName: string, value: string, setter: (value: string) => void) => {
    setter(value);
    saveField(fieldName, value);
  };

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://api.vapi.ai/call', {
        name: name,
        assistantId: "edfe48cf-8b3f-4753-972a-65533ac18ad2",
        phoneNumberId: "415f8310-feb3-40b0-b0a4-14370a0520ad",
        customers: [
          {
            number: phone,
            numberE164CheckEnabled: true
          }
        ]
      }, {
        headers: {
          'Authorization': 'Bearer eb1b8fe5-7571-403e-ba9a-a5d234823d8a',
          'Content-Type': 'application/json'
        }
      });

      setSuccess(true);
      setShowForm(false);
    } catch (err) {
      setError('There was an error scheduling your call. Please try again.');
      console.error('Error scheduling call:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while form data is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
            Talk to Our AI Assistant Now and Get Started Instantly!
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Skip the wait, get personalized recommendations, and launch your dream website today!
          </p>
          {!showForm && !success && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full 
                bg-gradient-to-r from-blue-600 to-purple-600
                hover:from-blue-500 hover:to-purple-500
                transition-all duration-300 transform hover:scale-105
                text-white font-semibold text-lg
                shadow-[0_0_20px_rgba(79,70,229,0.4)]
                hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
            >
              <MessageCircle className="w-6 h-6" />
              Talk to the AI Assistant Now
            </button>
          )}

          {showForm && (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleStartCall} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-center">
                    {error}
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => handleInputChange('aiAssistantName', e.target.value, setName)}
                      required
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => handleInputChange('aiAssistantPhone', e.target.value, setPhone)}
                      required
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="+1234567890"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full 
                      bg-gradient-to-r from-blue-600 to-purple-600
                      hover:from-blue-500 hover:to-purple-500
                      transition-all duration-300
                      text-white font-semibold
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Phone className="w-5 h-5" />
                        Start Call
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-green-400 mb-4">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Call Scheduled!</h2>
              </div>
              <p className="text-gray-300">
                You'll receive a call from our AI Assistant shortly. Please keep your phone handy!
              </p>
            </div>
          )}
        </div>

        {/* Introduction */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-16">
          <p className="text-xl text-gray-300 text-center">
            Welcome to the fastest way to get your website up and running! Our AI Assistant is here to guide 
            you through the process, answer your questions, and recommend the best website package tailored 
            to your needs—all in a matter of minutes. No pressure, just fast results!
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6
                hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">What Others Are Saying</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6"
              >
                <p className="text-lg text-gray-300 mb-4">"{testimonial.quote}"</p>
                <div className="text-purple-400">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reassurance */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8 mb-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Prefer a Human Touch?</h2>
          <p className="text-gray-300 mb-6">
            No problem! You can always schedule a call with one of our experts at any time. 
            But for now, the AI assistant is here to get you going instantly.
          </p>
          <Link
            to="/consultation"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
              bg-purple-500/20 hover:bg-purple-500/30 
              text-purple-400 hover:text-purple-300
              transition-all duration-300"
          >
            <Phone className="w-5 h-5" />
            Schedule a Human Call
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
            <Link to="#" className="hover:text-white transition-colors">Contact Us</Link>
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Support</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AIAssistantPage;