import React from 'react';
import { Share2, ArrowRight, Globe, Users, BarChart as ChartBar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  industry: string;
  stats: {
    conversionRate?: string;
    trafficIncrease?: string;
    leadGeneration?: string;
  };
  technologies: string[];
  link: string;
}

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Modern Real Estate Platform',
    description: 'A high-performance real estate platform with advanced property search, virtual tours, and automated lead capture system.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
    category: 'Real Estate',
    industry: 'Property',
    stats: {
      conversionRate: '215%',
      trafficIncrease: '180%',
      leadGeneration: '312%'
    },
    technologies: ['React', 'Node.js', 'Tailwind CSS', 'Supabase'],
    link: 'https://realestate-example.com'
  },
  {
    id: '2',
    title: 'Healthcare Provider Platform',
    description: 'An accessible and user-friendly healthcare platform featuring online appointments, patient portal, and automated scheduling.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1600',
    category: 'Healthcare',
    industry: 'Medical',
    stats: {
      conversionRate: '180%',
      trafficIncrease: '245%',
      leadGeneration: '167%'
    },
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
    link: 'https://healthcare-example.com'
  },
  {
    id: '3',
    title: 'E-commerce Fashion Store',
    description: 'A modern e-commerce platform with AI-powered recommendations, virtual try-on, and seamless checkout experience.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
    category: 'E-commerce',
    industry: 'Fashion',
    stats: {
      conversionRate: '156%',
      trafficIncrease: '290%',
      leadGeneration: '234%'
    },
    technologies: ['React', 'Node.js', 'Tailwind CSS', 'Stripe'],
    link: 'https://fashion-example.com'
  }
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link 
      to={`/portfolio/${project.id}`}
      className="group relative bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 block"
    >
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {project.category}
          </span>
          <span className="text-gray-500">{project.industry}</span>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
          {project.title}
        </h2>
        
        <p className="text-gray-400 mb-6">
          {project.description}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg">
          {project.stats.conversionRate && (
            <div className="text-center">
              <div className="text-purple-400 text-xl font-bold">{project.stats.conversionRate}</div>
              <div className="text-gray-500 text-sm">Conversion ↑</div>
            </div>
          )}
          {project.stats.trafficIncrease && (
            <div className="text-center">
              <div className="text-purple-400 text-xl font-bold">{project.stats.trafficIncrease}</div>
              <div className="text-gray-500 text-sm">Traffic ↑</div>
            </div>
          )}
          {project.stats.leadGeneration && (
            <div className="text-center">
              <div className="text-purple-400 text-xl font-bold">{project.stats.leadGeneration}</div>
              <div className="text-gray-500 text-sm">Leads ↑</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-3 py-1 rounded-full bg-gray-900/50 text-gray-400 text-sm border border-gray-700"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
            View Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          
          <button 
            className="p-2 rounded-full hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 transition-all"
            onClick={(e) => {
              e.preventDefault();
              navigator.share({
                title: project.title,
                text: project.description,
                url: window.location.href + '/' + project.id
              }).catch(() => {
                navigator.clipboard.writeText(window.location.href + '/' + project.id);
              });
            }}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Our Work
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our portfolio of successful projects where we've helped businesses 
            transform their online presence and achieve remarkable growth.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <p className="text-gray-400">Websites Launched</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">100+</div>
            <p className="text-gray-400">Happy Clients</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <ChartBar className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">200%</div>
            <p className="text-gray-400">Average Growth</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PORTFOLIO_PROJECTS.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PortfolioPage;