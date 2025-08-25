import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Users, BarChart as ChartBar, CheckCircle, ArrowRight } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from './PortfolioPage';

function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = PORTFOLIO_PROJECTS.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Project not found</h1>
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const projectDetails = {
    challenge: "The client needed a modern, high-performance website that would not only showcase their offerings but also automate their lead generation process. They were struggling with low conversion rates and manual customer management.",
    solution: "We developed a custom website with advanced features including automated lead capture, CRM integration, and a user-friendly interface. The site was optimized for both desktop and mobile users, with a focus on fast loading times and seamless navigation.",
    results: [
      "Increased conversion rate by 215%",
      "Reduced customer acquisition cost by 45%",
      "Automated 80% of lead management process",
      "Improved mobile engagement by 156%"
    ],
    features: [
      "Responsive design optimized for all devices",
      "Advanced search and filtering system",
      "Automated lead capture and nurturing",
      "Integration with popular CRM systems",
      "Real-time analytics dashboard",
      "Custom booking system"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 animate-fade-in">
        <button
          onClick={() => navigate('/portfolio')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </button>

        <div className="aspect-w-16 aspect-h-9 mb-8 rounded-2xl overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[500px] object-cover"
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {project.category}
          </span>
          <span className="text-gray-400">{project.industry}</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-6">
          {project.title}
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          {project.stats.conversionRate && (
            <div className="text-center">
              <div className="text-purple-400 text-3xl font-bold mb-1">{project.stats.conversionRate}</div>
              <div className="text-gray-400">Conversion Increase</div>
            </div>
          )}
          {project.stats.trafficIncrease && (
            <div className="text-center">
              <div className="text-purple-400 text-3xl font-bold mb-1">{project.stats.trafficIncrease}</div>
              <div className="text-gray-400">Traffic Growth</div>
            </div>
          )}
          {project.stats.leadGeneration && (
            <div className="text-center">
              <div className="text-purple-400 text-3xl font-bold mb-1">{project.stats.leadGeneration}</div>
              <div className="text-gray-400">Lead Generation</div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">The Challenge</h2>
            <p className="text-gray-300">{projectDetails.challenge}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Our Solution</h2>
            <p className="text-gray-300">{projectDetails.solution}</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Key Results</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {projectDetails.results.map((result, index) => (
              <div key={index} className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{result}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Features Implemented</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {projectDetails.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <h3 className="text-lg font-medium text-white mr-4">Technologies Used:</h3>
          {project.technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-gray-300 mb-6">
            Let's create something amazing together that drives real results for your business.
          </p>
          <button
            onClick={() => navigate('/consultation')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 
              hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105
              text-white font-semibold text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)]
              hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;