import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import {
  getUserProfile,
  createOrUpdateUserProfile,
  getConsultationData,
  getOnboardingData,
  getPackageSelections,
  createUserSession,
  trackPageVisit,
  UserProfile,
  ConsultationData,
  OnboardingData,
  PackageSelection,
  UserSession
} from '../lib/userData';

export function useUserData() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [packageSelections, setPackageSelections] = useState<PackageSelection[]>([]);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
      initializeSession();
    } else {
      resetData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load all user data in parallel
      const [profile, consultationData, onboardingData, packageData] = await Promise.all([
        getUserProfile(user),
        getConsultationData(user),
        getOnboardingData(user),
        getPackageSelections(user)
      ]);

      setUserProfile(profile);
      setConsultations(consultationData);
      setOnboarding(onboardingData);
      setPackageSelections(packageData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSession = async () => {
    if (!user) return;

    try {
      const session = await createUserSession(user);
      setCurrentSession(session);
    } catch (error) {
      console.error('Error creating user session:', error);
    }
  };

  const resetData = () => {
    setUserProfile(null);
    setConsultations([]);
    setOnboarding(null);
    setPackageSelections([]);
    setCurrentSession(null);
    setLoading(false);
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return null;

    try {
      const updatedProfile = await createOrUpdateUserProfile(user, profileData);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  };

  const refreshData = () => {
    if (user) {
      loadUserData();
    }
  };

  const trackPage = async (page: string) => {
    if (user) {
      await trackPageVisit(user, page);
    }
  };

  return {
    userProfile,
    consultations,
    onboarding,
    packageSelections,
    currentSession,
    loading,
    updateProfile,
    refreshData,
    trackPage
  };
}

export default useUserData;