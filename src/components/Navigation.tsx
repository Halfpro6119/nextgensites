import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ to, children, onClick }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        relative px-4 py-2
        text-sm font-medium
        transition-colors duration-200
        ${isActive ? 'text-purple-400' : 'text-gray-300 hover:text-white'}
        group
      `}
    >
      {children}
      <span className={`
        absolute bottom-0 left-0 w-full h-0.5
        transform origin-left scale-x-0 
        transition-transform duration-200
        bg-gradient-to-r from-blue-400 to-purple-400
        group-hover:scale-x-100
        ${isActive ? 'scale-x-100' : ''}
      `} />
    </Link>
  );
}

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-300
      ${isScrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Web Design Studio
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/portfolio">Our Work</NavLink>
            <NavLink to="/consultation">Onboarding</NavLink>
            <NavLink to="/newsletter">Newsletter</NavLink>
            {user?.email === 'rilrogsa@gmail.com' && (
              <NavLink to="/inbox">Inbox</NavLink>
            )}
            
            {user ? (
              <Link
                to="/dashboard"
                className={`
                  ml-6 px-6 py-2 rounded-full
                  bg-gray-800 hover:bg-gray-700
                  border border-gray-600 hover:border-purple-500
                  transition-all duration-300
                  text-white font-semibold
                  flex items-center gap-2
                `}
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/consultation"
                className={`
                  ml-6 px-6 py-2 rounded-full
                  bg-gradient-to-r from-blue-600 to-purple-600
                  hover:from-blue-500 hover:to-purple-500
                  transition-all duration-300 transform hover:scale-105
                  text-white font-semibold
                  shadow-[0_0_20px_rgba(79,70,229,0.4)]
                  hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]
                `}
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white focus:outline-none"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`
          md:hidden
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          ${isScrolled ? 'bg-gray-900/95 backdrop-blur-lg' : 'bg-gray-900'}
        `}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/portfolio" onClick={closeMenu}>Our Work</NavLink>
          <NavLink to="/consultation" onClick={closeMenu}>Book a Call</NavLink>
          <NavLink to="/newsletter" onClick={closeMenu}>Newsletter</NavLink>
          {user?.email === 'rilrogsa@gmail.com' && (
            <NavLink to="/inbox" onClick={closeMenu}>Inbox</NavLink>
          )}
          
          {user ? (
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className={`
                block mt-4 mx-2 px-6 py-2 rounded-full
                bg-gray-800 hover:bg-gray-700
                border border-gray-600 hover:border-purple-500
                transition-all duration-300
                text-white font-semibold text-center
                flex items-center justify-center gap-2
              `}
            >
              <User className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <Link
              to="/consultation"
              onClick={closeMenu}
              className={`
                block mt-4 mx-2 px-6 py-2 rounded-full
                bg-gradient-to-r from-blue-600 to-purple-600
                hover:from-blue-500 hover:to-purple-500
                transition-all duration-300
                text-white font-semibold text-center
                shadow-[0_0_20px_rgba(79,70,229,0.4)]
                hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]
              `}
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;