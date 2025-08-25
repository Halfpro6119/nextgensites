import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  ArrowRight, 
  Eye, 
  Mail, 
  Shield,
  Home,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { getOutreachData, OutreachData } from '../lib/supabase';

function ReviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<OutreachData | null>(null);
  const [loading, setLoading] = useState(true);

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
      document.title = `Website Review for ${outreachData['account name']} | Built by Riley`;
      
      // Add meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Personal website review and recommendations for ${outreachData['account name']} by Riley.`
        );
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

  const handleViewDemo = () => {
    navigate(`/demo/${slug}`);
  };

  const handleGetStarted = () => {
    navigate('/consultation', {
      state: {
        name: data?.['contact name'],
        email: data?.['contact email'],
        company: data?.['account name'],
        website: data?.['account website'],
        source: 'Review Page'
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative">
        {/* Personal Greeting Block */}
        <section className="pt-16 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 md:p-12 text-center">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  👋 Hi {data['contact name'].split(' ')[0]}, I built this just for you.
                </h1>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  This page is live and built exclusively for <strong className="text-white">{data['account name']}</strong> to show what a 
                  higher-converting site could look like — based on your real website and goals.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/20">
                <Shield className="w-4 h-4" />
                Personalized for {data['account name']}
              </div>
            </div>
          </div>
        </section>

        {/* What I Found */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                🔍 What I Found
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                After reviewing your current site, I found a few issues that may be limiting results.
              </p>
            </div>
            
            <div className="space-y-6 mb-8">
              {[data.owner_pain_point_1, data.owner_pain_point_2].map((pain, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">Issue #{index + 1}</h3>
                      <p className="text-gray-300 leading-relaxed">{pain}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center text-gray-400 italic">
              These can quietly reduce trust and lead flow — especially on mobile.
            </p>
          </div>
        </section>

        {/* How I Fixed It */}
        <section className="py-12 px-4 bg-gray-800/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                🛠️ How I Fixed It (Just for You)
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                data.owner_conversion_benefit_1,
                data.owner_conversion_benefit_2,
                data.owner_conversion_benefit_3
              ].map((benefit, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">Fix #{index + 1}</h3>
                      <p className="text-gray-300 leading-relaxed text-sm">{benefit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center text-green-400 font-medium">
              ✅ This version is live right now and ready to go.
            </p>
          </div>
        </section>

        {/* Demo Preview */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              👀 Your New Demo Preview
            </h2>
            
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="text-gray-300 font-medium">
                      Click below to see a working version designed for your actual audience.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleViewDemo}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                    hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105
                    shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
                >
                  <Eye className="w-5 h-5" />
                  View the Live Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <p className="text-sm text-gray-400 mt-4">
                  🔓 No sign-up needed. It's already live.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote/Review Block */}
        <section className="py-12 px-4 bg-gray-800/30">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 text-center">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg md:text-xl italic text-gray-300 mb-4 leading-relaxed">
                "{data.owner_hook_quote || `Built using best practices from high-converting sites in the ${data.industry} space.`}"
              </blockquote>
              <div className="text-gray-400 text-sm">
                ⭐ Trusted by businesses across the {data.industry} industry
              </div>
            </div>
          </div>
        </section>

        {/* Bonus Copy Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                This is a real, working page — not a mockup.
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto">
                I can have it live on your real domain in 24–48 hours, or we can adjust anything you'd like. 
                Either way, this shows what's possible.
              </p>
              <p className="text-lg font-semibold text-blue-400">
                Let's make it real?
              </p>
            </div>
          </div>
        </section>

        {/* Final Trust CTA Block */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                ✅ Want a modern, SEO-optimized website that actually converts?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                This isn't a template — it's built for your brand, your customers, and your goals.
              </p>
              
              <div className="space-y-4">
                <a
                  href={data.owner_cta_link}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 
                    hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105
                    shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                >
                  <Mail className="w-5 h-5" />
                  {data.owner_cta_text}
                  <ArrowRight className="w-5 h-5" />
                </a>
                
                <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  🔒 No pressure. No obligations. Just results — designed by Riley.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-gray-900/80">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-8 text-gray-300 mb-8">
              <a href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </a>
              <a href="/#faq" className="hover:text-white transition-colors">FAQs</a>
              <a href="mailto:riley@nextgensites.net" className="hover:text-white transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact Riley
              </a>
            </div>
            <div className="text-center text-gray-400 text-sm">
              Site created by Riley – helping {data.industry} businesses build trust and win more leads online.
            </div>
          </div>
        </footer>
      </div>

      {/* Schema markup for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `Website Review for ${data['account name']}`,
          "description": `Personal website review and recommendations for ${data['account name']} by Riley`,
          "author": {
            "@type": "Person",
            "name": "Riley"
          },
          "about": {
            "@type": "Organization",
            "name": data['account name'],
            "industry": data.industry
          }
        })}
      </script>
    </div>
  );
}

export default ReviewPage;