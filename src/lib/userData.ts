import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  email: string;
  name: string;
  phone: string;
  company: string;
  website: string;
  created_at: string;
  updated_at: string;
  last_login: string;
}

export interface ConsultationData {
  id?: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  question: string;
  automations?: string;
  source?: string;
  submitted_at?: string;
}

export interface OnboardingData {
  id?: string;
  user_id: string;
  business_name?: string;
  business_description?: string;
  goals?: string[];
  other_goal?: string;
  design_style?: string;
  current_website?: string;
  inspiration_sites?: string;
  desired_pages?: string;
  avoid_features?: string;
  budget?: string;
  additional_info?: string;
  assets_uploaded?: boolean;
  submitted_at?: string;
}

export interface PackageSelection {
  id?: string;
  user_id: string;
  package_type: 'website' | 'care_plan';
  package_id: string;
  package_name: string;
  price_id: string;
  price: string;
  mode: 'payment' | 'subscription';
  selected_at?: string;
  checkout_initiated?: boolean;
  checkout_session_id?: string;
  purchase_completed?: boolean;
  purchase_completed_at?: string;
}

export interface UserSession {
  id?: string;
  user_id: string;
  session_start?: string;
  session_end?: string;
  pages_visited?: string[];
  forms_started?: string[];
  forms_completed?: string[];
  last_activity?: string;
}

// User Profile Functions
export async function getUserProfile(authUser: User): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', authUser.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function createOrUpdateUserProfile(authUser: User, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      auth_user_id: authUser.id,
      email: authUser.email || '',
      ...profileData,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'auth_user_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating/updating user profile:', error);
    return null;
  }

  return data;
}

// Consultation Functions
export async function saveConsultationData(authUser: User, consultationData: Omit<ConsultationData, 'id' | 'user_id'>): Promise<ConsultationData | null> {
  // First ensure user profile exists
  const userProfile = await getUserProfile(authUser);
  if (!userProfile) {
    console.error('User profile not found');
    return null;
  }

  const { data, error } = await supabase
    .from('user_consultations')
    .insert({
      user_id: userProfile.id,
      ...consultationData,
      submitted_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving consultation data:', error);
    return null;
  }

  return data;
}

export async function getConsultationData(authUser: User): Promise<ConsultationData[]> {
  const userProfile = await getUserProfile(authUser);
  if (!userProfile) return [];

  const { data, error } = await supabase
    .from('user_consultations')
    .select('*')
    .eq('user_id', userProfile.id)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching consultation data:', error);
    return [];
  }

  return data || [];
}

// Onboarding Functions
export async function saveOnboardingData(authUser: User, onboardingData: Omit<OnboardingData, 'id' | 'user_id'>): Promise<OnboardingData | null> {
  const userProfile = await getUserProfile(authUser);
  if (!userProfile) {
    console.error('User profile not found');
    return null;
  }

  const { data, error } = await supabase
    .from('user_onboarding')
    .upsert({
      user_id: userProfile.id,
      ...onboardingData,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving onboarding data:', error);
    return null;
  }

  return data;
}

export async function getOnboardingData(authUser: User): Promise<OnboardingData | null> {
  const userProfile = await getUserProfile(authUser);
  if (!userProfile) return null;

  const { data, error } = await supabase
    .from('user_onboarding')
    .select('*')
    .eq('user_id', userProfile.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching onboarding data:', error);
    return null;
  }

  return data;
}

// Package Selection Functions
export async function savePackageSelection(authUser: User, packageData: Omit<PackageSelection, 'id' | 'user_id'>): Promise<PackageSelection | null> {
  const userProfile = await getUserProfile(authUser);
  if (!userProfile) {
    console.error('User profile not found');
    return null;
  }

  const { data, error } = await supabase
    .from('user_package_selections')
    .insert({
      user_id: userProfile.id,
      ...packageData,
      selected_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving package selection:', error);
    return null;
  }

  return data;
}

export async function updatePackageSelection(authUser: User, selectionId: string, updates: Partial<PackageSelection>): Promise<PackageSelection | null> {
  const { data, error } = await supabase
    .from('user_package_selections')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', selectionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating package selection:', error);
    return null;
  }

  return data;
}

export async function getPackageSelections(authUser: User): Promise<PackageSelection[]> {
  const userProfile = await getUserProfile(authUser);
  if (!userProfile) return [];

  const { data, error } = await supabase
    .from('user_package_selections')
    .select('*')
    .eq('user_id', userProfile.id)
    .order('selected_at', { ascending: false });

  if (error) {
    console.error('Error fetching package selections:', error);
    return [];
  }

  return data || [];
}

// Session Tracking Functions
export async function createUserSession(authUser: User): Promise<UserSession | null> {
  const userProfile = await getUserProfile(authUser);
  if (!userProfile) return null;

  const { data, error } = await supabase
    .from('user_sessions')
    .insert({
      user_id: userProfile.id,
      session_start: new Date().toISOString(),
      last_activity: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user session:', error);
    return null;
  }

  return data;
}

export async function updateUserSession(sessionId: string, updates: Partial<UserSession>): Promise<UserSession | null> {
  const { data, error } = await supabase
    .from('user_sessions')
    .update({
      ...updates,
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user session:', error);
    return null;
  }

  return data;
}

export async function trackPageVisit(authUser: User, page: string): Promise<void> {
  const userProfile = await getUserProfile(authUser);
  if (!userProfile) return;

  // Get the most recent session
  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userProfile.id)
    .order('session_start', { ascending: false })
    .limit(1);

  if (sessions && sessions.length > 0) {
    const session = sessions[0];
    const pagesVisited = session.pages_visited || [];
    
    if (!pagesVisited.includes(page)) {
      await updateUserSession(session.id, {
        pages_visited: [...pagesVisited, page]
      });
    }
  }
}

export async function trackFormActivity(authUser: User, formName: string, action: 'started' | 'completed'): Promise<void> {
  const userProfile = await getUserProfile(authUser);
  if (!userProfile) return;

  // Get the most recent session
  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userProfile.id)
    .order('session_start', { ascending: false })
    .limit(1);

  if (sessions && sessions.length > 0) {
    const session = sessions[0];
    const formsStarted = session.forms_started || [];
    const formsCompleted = session.forms_completed || [];
    
    const updates: Partial<UserSession> = {};
    
    if (action === 'started' && !formsStarted.includes(formName)) {
      updates.forms_started = [...formsStarted, formName];
    } else if (action === 'completed' && !formsCompleted.includes(formName)) {
      updates.forms_completed = [...formsCompleted, formName];
    }
    
    if (Object.keys(updates).length > 0) {
      await updateUserSession(session.id, updates);
    }
  }
}