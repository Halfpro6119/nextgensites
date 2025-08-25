import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SlugData {
  slug: string;
  'account name': string;
  'contact name': string;
}

function DebugSlugsPage() {
  const [slugs, setSlugs] = useState<SlugData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlugs = async () => {
      try {
        const { data, error } = await supabase
          .from('Outreach')
          .select('slug, "account name", "contact name"')
          .order('slug');

        if (error) {
          console.error('Error fetching slugs:', error);
          setError(error.message);
        } else {
          console.log('Found slugs:', data);
          setSlugs(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSlugs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Debug: Available Slugs</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        <div className="bg-gray-800/50 rounded-lg p-6">
          <p className="text-gray-300 mb-4">Found {slugs.length} records in Outreach table:</p>
          
          {slugs.length === 0 ? (
            <p className="text-gray-400">No slugs found in the database.</p>
          ) : (
            <div className="space-y-2">
              {slugs.map((item, index) => (
                <div key={index} className="bg-gray-700/50 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{item.slug}</span>
                      <span className="text-gray-400 ml-2">({item['account name']})</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`/review/${item.slug}`}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Test Review
                      </a>
                      <a
                        href={`/demo/${item.slug}`}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Test Demo
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DebugSlugsPage;