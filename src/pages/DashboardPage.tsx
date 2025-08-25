import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, FileText, MessageCircle, ArrowRight, LogOut, User, Mail, Package, Clock, CheckCircle } from 'lucide-react';
import SubscriptionStatus from '../components/SubscriptionStatus';
import { useAuth } from '../components/AuthProvider';
import { signOut } from '../lib/auth';
import useUserData from '../hooks/useUserData';
import SignInModal from '../components/SignInModal';

function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { userProfile, consultations, onboarding, packageSelections, loading: dataLoading } = useUserData();
  const [showSignInModal, setShowSignInModal] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Contact Support',
      description: 'Get help with your account or projects',
      action: () => window.location.href = 'mailto:Riley@nextgensites.net',
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Manage your subscription and billing',
      action: () => navigate('/settings'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
        
        <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-400">Sign in to access your dashboard</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowSignInModal(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold text-white
                  transition-all duration-300 transform hover:scale-105 text-center"
              >
                Sign In to Your Account
              </button>
              
              <div className="text-center">
                <span className="text-gray-400">or</span>
              </div>
              
              <Link
                to="/consultation"
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 
                  rounded-lg font-semibold text-white transition-all duration-300 
                  text-center block"
              >
                Get Started - Free Consultation
              </Link>
              
              <Link
                to="/skip-call"
                className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 
                  rounded-lg font-semibold text-white transition-all duration-300 
                  text-center block"
              >
                Browse Packages
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm mb-4">
                Need help? Contact us directly
              </p>
              <a
                href="mailto:Riley@nextgensites.net"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Riley@nextgensites.net
              </a>
            </div>
          </div>

          {/* Sign In Modal */}
          <SignInModal
            isOpen={showSignInModal}
            onClose={() => setShowSignInModal(false)}
            onSuccess={() => {
              setShowSignInModal(false);
              // The page will automatically update due to auth state change
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              Welcome Back{userProfile?.name ? `, ${userProfile.name}` : ''}!
            </h1>
            <p className="text-xl text-gray-300">
              Manage your projects and subscription from your dashboard.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-medium">{user.email}</div>
              <div className="text-gray-400 text-sm">Account Dashboard</div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 
                hover:border-red-500 transition-all duration-300 text-gray-400 hover:text-red-400"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Subscription Status */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Your Plan</h2>
            <SubscriptionStatus />
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group relative bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 
                    hover:border-purple-500/50 transition-all duration-300 text-left
                    transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} bg-opacity-20 
                      flex items-center justify-center flex-shrink-0`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1 group-hover:text-purple-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {action.description}
                      </p>
                      <div className="flex items-center gap-2 text-purple-400 text-sm">
                        <span>Get started</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Data Overview */}
        {!dataLoading && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Consultation Status */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Consultations</h3>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {consultations.length}
              </div>
              <p className="text-gray-400 text-sm">
                {consultations.length === 0 ? 'No consultations yet' : 
                 consultations.length === 1 ? 'Consultation submitted' : 
                 'Consultations submitted'}
              </p>
              {consultations.length === 0 && (
                <Link
                  to="/consultation"
                  className="mt-3 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  Start consultation <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Onboarding Status */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Onboarding</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {onboarding ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-400" />
                )}
                <span className="text-lg font-bold text-white">
                  {onboarding ? 'Complete' : 'Pending'}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {onboarding ? 'Onboarding form completed' : 'Complete your onboarding'}
              </p>
              {!onboarding && (
                <Link
                  to="/onboarding"
                  className="mt-3 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                >
                  Complete onboarding <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Package Selections */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-bold text-white">Packages</h3>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-2">
                {packageSelections.length}
              </div>
              <p className="text-gray-400 text-sm">
                {packageSelections.length === 0 ? 'No packages selected' :
                 packageSelections.filter(p => p.purchase_completed).length > 0 ? 
                 `${packageSelections.filter(p => p.purchase_completed).length} purchased` :
                 'Packages selected'}
              </p>
              {packageSelections.length === 0 && (
                <Link
                  to="/skip-call"
                  className="mt-3 inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm"
                >
                  Browse packages <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Package History */}
        {packageSelections.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Package History</h2>
            <div className="space-y-4">
              {packageSelections.map((selection) => (
                <div key={selection.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{selection.package_name}</h3>
                      <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs">
                        {selection.package_type}
                      </span>
                      {selection.purchase_completed && (
                        <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                          Purchased
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {selection.price} • Selected {new Date(selection.selected_at!).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-400 font-bold">{selection.price}</div>
                    <div className="text-gray-500 text-sm capitalize">{selection.mode}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {consultations.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-white font-medium">Consultation submitted</div>
                  <div className="text-gray-400 text-sm">Your consultation form was received</div>
                </div>
                <div className="text-gray-500 text-sm">
                  {new Date(consultations[0].submitted_at!).toLocaleDateString()}
                </div>
              </div>
            )}
            {onboarding && (
              <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-white font-medium">Onboarding completed</div>
                  <div className="text-gray-400 text-sm">Your project details were submitted</div>
                </div>
                <div className="text-gray-500 text-sm">
                  {new Date(onboarding.submitted_at!).toLocaleDateString()}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-white font-medium">Account created</div>
                <div className="text-gray-400 text-sm">Welcome to Web Design Studio</div>
              </div>
              <div className="text-gray-500 text-sm">
                {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'Recently'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;