import React from 'react';
import Newsletter from '../components/Newsletter';

function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            AI Automation Newsletter
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get exclusive insights, proven strategies, and expert guidance on implementing AI 
            automation to scale your business faster.
          </p>
        </div>

        <Newsletter />
      </div>
    </div>
  );
}

export default NewsletterPage;