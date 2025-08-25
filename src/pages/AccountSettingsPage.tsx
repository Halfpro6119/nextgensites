import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Package, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Crown,
  Calendar,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Building,
  X,
  Trash2
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import useUserData from '../hooks/useUserData';
import SubscriptionStatus from '../components/SubscriptionStatus';
import { STRIPE_PRODUCTS, CARE_PLANS } from '../stripe-config';
import { createCheckoutSession } from '../lib/stripe';
import { updatePackageSelection } from '../lib/userData';
import { supabase } from '../lib/supabase';

function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userProfile, packageSelections, loading, updateProfile, refreshData } = useUserData();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    company: userProfile?.company || '',
    website: userProfile?.website || ''
  });

  const allProducts = [...STRIPE_PRODUCTS, ...CARE_PLANS];
  
  // Get purchased packages
  const purchasedPackages = packageSelections.filter(p => p.purchase_completed);
  
  // Get selected but unpaid packages (deduplicated by price_id)
  const unpaidPackages = packageSelections
    .filter(p => !p.purchase_completed)
    .reduce((acc, current) => {
      // Only keep the most recent selection for each price_id
      const existing = acc.find(item => item.price_id === current.price_id);
      if (!existing || new Date(current.selected_at!) > new Date(existing.selected_at!)) {
        return [...acc.filter(item => item.price_id !== current.price_id), current];
      }
      return acc;
    }, [] as typeof packageSelections);

  // Get available products (exclude already purchased or selected ones)
  const purchasedPriceIds = new Set(purchasedPackages.map(p => p.price_id));
  const unpaidPriceIds = new Set(unpaidPackages.map(p => p.price_id));
  const availableProducts = allProducts.filter(product => 
    !purchasedPriceIds.has(product.priceId) && !unpaidPriceIds.has(product.priceId)
  );

  const handlePurchase = async (packageSelection: any) => {
    if (!user) return;
    
    setIsProcessing(packageSelection.id);
    
    try {
      // Update the package selection to mark checkout as initiated
      await updatePackageSelection(user, packageSelection.id, {
        checkout_initiated: true
      });
      
      // Create checkout session
      await createCheckoutSession(packageSelection.price_id, packageSelection.mode);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error processing payment. Please try again.');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRemoveSelection = async (packageSelection: any) => {
    if (!user) return;
    
    setIsRemoving(packageSelection.id);
    
    try {
      // First get the user profile to ensure we have the correct user_id
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (profileError || !userProfile) {
        throw new Error('User profile not found');
      }

      // Delete the package selection from the database using both user_id and selection id for security
      const { error } = await supabase
        .from('user_package_selections')
        .delete()
        .eq('id', packageSelection.id)
        .eq('user_id', userProfile.id);

      if (error) {
        console.error('Database error removing selection:', error);
        throw error;
      }

      // Refresh the data to update the UI
      refreshData();
      
      console.log('Successfully removed package selection:', packageSelection.id);
    } catch (error) {
      console.error('Error removing package selection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error removing selection: ${errorMessage}. Please try again.`);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile(profileData);
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Account Settings
          </h1>
          <p className="text-xl text-gray-300">
            Manage your profile, subscriptions, and billing information.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Settings */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {editingProfile ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Auto-add https:// if user enters a domain without protocol
                        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                          value = 'https://' + value;
                        }
                        setProfileData({...profileData, website: value});
                      }}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{user.email}</span>
                  </div>
                  {userProfile?.name && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{userProfile.name}</span>
                    </div>
                  )}
                  {userProfile?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{userProfile.phone}</span>
                    </div>
                  )}
                  {userProfile?.company && (
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{userProfile.company}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Current Subscription */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Current Subscription
              </h2>
              <SubscriptionStatus />
            </div>
          </div>

          {/* Plans and Packages */}
          <div className="lg:col-span-2">
            {/* Unpaid Packages */}
            {unpaidPackages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Complete Your Purchase
                </h2>
                <div className="space-y-4">
                  {unpaidPackages.map((packageSelection) => {
                    const product = allProducts.find(p => p.priceId === packageSelection.price_id);
                    return (
                      <div key={packageSelection.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">{packageSelection.package_name}</h3>
                            <p className="text-gray-300 mb-2">{packageSelection.price}</p>
                            <div className="flex items-center gap-2 text-yellow-400 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>Selected {new Date(packageSelection.selected_at!).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleRemoveSelection(packageSelection)}
                              disabled={isRemoving === packageSelection.id}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 
                                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove selection"
                            >
                              {isRemoving === packageSelection.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handlePurchase(packageSelection)}
                              disabled={isProcessing === packageSelection.id}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 
                                rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105
                                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isProcessing === packageSelection.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Complete Purchase
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Purchased Packages */}
            {purchasedPackages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Your Packages
                </h2>
                <div className="space-y-4">
                  {purchasedPackages.map((packageSelection) => (
                    <div key={packageSelection.id} className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-2">{packageSelection.package_name}</h3>
                          <p className="text-gray-300 mb-2">{packageSelection.price}</p>
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Purchased {new Date(packageSelection.purchase_completed_at!).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="px-4 py-2 bg-green-500/20 rounded-lg">
                          <span className="text-green-400 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Plans */}
            {availableProducts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Available Plans
                </h2>
                
                {/* Website Packages */}
                {availableProducts.some(p => STRIPE_PRODUCTS.includes(p as any)) && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Website Packages</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableProducts
                        .filter(p => STRIPE_PRODUCTS.includes(p as any))
                        .map((product) => (
                          <div key={product.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">{product.emoji}</span>
                              <h4 className="text-lg font-bold text-white">{product.name}</h4>
                            </div>
                            <p className="text-gray-400 mb-4">{product.description}</p>
                            <div className="text-2xl font-bold text-purple-400 mb-4">{product.price}</div>
                            <button
                              onClick={() => navigate('/skip-call')}
                              className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Select Package
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Care Plans */}
                {availableProducts.some(p => CARE_PLANS.includes(p as any)) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Monthly Care Plans</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableProducts
                        .filter(p => CARE_PLANS.includes(p as any))
                        .map((plan) => (
                          <div key={plan.id} className="bg-gray-800/50 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">{plan.emoji}</span>
                              <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                            </div>
                            <p className="text-gray-400 mb-4">{plan.description}</p>
                            <div className="text-2xl font-bold text-blue-400 mb-4">{plan.price}</div>
                            <button
                              onClick={() => navigate('/skip-call')}
                              className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              Add Plan
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Available Plans Message */}
            {availableProducts.length === 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">All Plans Selected</h3>
                <p className="text-gray-400">
                  You have already selected or purchased all available plans. Check back later for new offerings!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettingsPage;