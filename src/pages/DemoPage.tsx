import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Mail, 
  AlertTriangle,
  Users,
  Target,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getOutreachData, OutreachData } from '../lib/supabase';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useFormContext } from '../context/FormContext';

function DemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isLoaded } = useFormContext();
  const { saveField } = useFormPersistence({ formName: 'demoContact' });
  const [data, setData] = useState<OutreachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    saveField(fieldName, value);
  };

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      const outreachData = await getOutreachData(slug);
      if (!outreachData) {
        navigate('/');
        return;
      }
      setData(outreachData);
      setLoading(false);

      // Set page title and meta
      document.title = `${outreachData.hero_heading} | ${outreachData['account name']}`;
      
      // Add meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', outreachData.hero_subheading);
      }

      // Add Google Analytics if provided
      if (outreachData.ga_tracking_id) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${outreachData.ga_tracking_id}`;
        document.head.appendChild(script);

        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${outreachData.ga_tracking_id}');
        `;
        document.head.appendChild(script2);
      }
    };

    fetchData();
  }, [slug, navigate]);

  const testimonials = data ? [
    { text: data.review_1, author: data.reviewer_1 },
    { text: data.review_2, author: data.reviewer_2 },
    { text: data.review_3, author: data.reviewer_3 }
  ] : [];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit to database (async)
    if (slug && formData.message.trim()) {
      submitContactRequest(slug, formData.message)
        .then((result) => {
          if (result) {
            // Clear the message field but keep other data
            setFormData(prev => ({ ...prev, message: '' }));
            alert('Message sent successfully! We\'ll get back to you soon.');
          } else {
            alert('Error sending message. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error submitting message:', error);
          alert('Error sending message. Please try again.');
        });
    }
  };

  const handleGetStarted = () => {
    navigate(`/next-steps/${slug}`);
  };

  const handleMakeLive = () => {
    navigate(`/next-steps/${slug}`);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-neutral-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gray-300/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200/20 via-transparent to-gray-300/20"></div>
          <div className="relative max-w-6xl mx-auto text-center">
            <div className="relative inline-block mb-8">
              <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                {data.hero_heading}
              </h1>
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gray-300/20 rounded-full blur-xl animate-bounce"></div>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              {data.hero_subheading}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={scrollToContact}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 
                  hover:from-green-400 hover:to-green-500 rounded-full font-semibold text-lg
                  transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                  hover:shadow-green-500/25 text-white"
              >
                <span className="flex items-center gap-2">
                  {data.customer_cta_text}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </button>
            </div>
          </div>
        </section>

        {/* Trust & Rating Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white backdrop-blur-lg rounded-2xl p-8 border border-gray-200 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              {data.google_rating >= 4 && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xl font-bold text-gray-700 ml-2">
                    {data.google_rating}/5 Google Rating
                  </span>
                </div>
              )}
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "{data.customer_hook_quote}"
              </blockquote>
              <p className="text-gray-600">
                {data.google_rating}★ rating on Google based on happy customers
              </p>
            </div>
          </div>
        </section>

        {/* Customer Pain Points */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
              Frustrated with these common problems?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[data.customer_pain_point_1, data.customer_pain_point_2].map((pain, index) => (
                <div 
                  key={index}
                  className="group relative bg-white border border-orange-200 rounded-2xl p-8 
                    hover:border-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20
                    transform hover:-translate-y-2"
                >
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-300/30 rounded-full blur-sm animate-pulse"></div>
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-orange-600 mb-4">
                        Challenge #{index + 1}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {pain}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
              Here's how we help
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                data.customer_conversion_benefit_1,
                data.customer_conversion_benefit_2,
                data.customer_conversion_benefit_3
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className="group relative bg-white border border-green-200 rounded-2xl p-8 
                    hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20
                    transform hover:-translate-y-2 hover:bg-green-50"
                >
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-300/40 rounded-full blur-sm animate-pulse"></div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-green-600 mb-3">
                        Solution #{index + 1}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
              Why {data['account name']} stands out
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Users, text: data.customer_benefit_1 },
                { icon: Target, text: data.customer_benefit_2 },
                { icon: Zap, text: data.customer_benefit_3 }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group relative bg-white border border-blue-200 rounded-2xl p-8 
                    hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20
                    transform hover:-translate-y-1"
                >
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-300/40 rounded-full blur-sm animate-pulse delay-300"></div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-blue-600 mb-3">
                        Benefit #{index + 1}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3-Step Process Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
              What happens next?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[data.process_step_1, data.process_step_2, data.process_step_3].map((step, index) => (
                <div 
                  key={index}
                  className="relative bg-white border border-blue-200 rounded-2xl p-8 
                    hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20
                    transform hover:-translate-y-1"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-blue-600 mb-4">
                      Step {index + 1}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
              What customers are saying
            </h2>
            <div className="relative bg-white backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-purple-600" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-purple-600" />
                </button>
              </div>
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl italic text-gray-700 mb-6">
                  "{testimonials[currentTestimonial]?.text}"
                </blockquote>
                <div className="text-purple-600 font-medium">
                  — {testimonials[currentTestimonial]?.author}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section + Form */}
        <section id="contact" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                {data.customer_cta_text}
              </h2>
              <p className="text-xl text-gray-700">
                Tell us about your project and we'll get back to you soon
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-white backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 
                      hover:from-green-400 hover:to-green-500 rounded-lg font-semibold text-lg text-white
                      transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                      hover:shadow-green-500/25"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Direct Contact Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Prefer to chat?</h3>
              <p className="text-gray-700 mb-6">
                Get in touch directly for immediate assistance
              </p>
              <a
                href={`mailto:${data['contact email']}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 
                  rounded-lg text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email us at {data['contact email']}
              </a>
            </div>
          </div>
        </section>

        {/* Final Owner CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-12 border border-blue-200 overflow-hidden shadow-lg">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-200/40 rounded-full blur-lg animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-200/40 rounded-full blur-lg animate-pulse delay-1000"></div>
              
              <div className="relative text-center">
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                  This demo was handcrafted by Riley to show what's possible for {data['account name']}. 
                  If you're ready to attract more customers and boost your Google ranking, let's get it live.
                </p>
                
                <button
                  onClick={handleMakeLive}
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 
                    hover:from-green-400 hover:to-green-500 rounded-lg font-semibold text-lg text-white
                    transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                    hover:shadow-green-500/25"
                >
                  <span className="flex items-center gap-2">
                    Make This Your Real Website
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent"></div>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-8 text-gray-600 mb-8">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="mailto:riley@nextgensites.net" className="hover:text-white transition-colors">
                Contact Riley
              </a>
            </div>
            <div className="text-center text-gray-600 text-sm">
              Website crafted by Riley — clarity, trust, results.
            </div>
          </div>
        </footer>
      </div>

      {/* Schema markup for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": data['account name'],
          "description": data.hero_subheading,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": data.google_rating,
            "reviewCount": "50+"
          },
          "review": testimonials.map(testimonial => ({
            "@type": "Review",
            "reviewBody": testimonial.text,
            "author": {
              "@type": "Person",
              "name": testimonial.author
            }
          }))
        })}
      </script>
    </div>
  );
}

export default DemoPage;