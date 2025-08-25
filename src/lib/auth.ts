import { supabase } from './supabase';

export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return user;
}

export async function ensureAuthenticated() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    throw new Error('Failed to get session: ' + error.message);
  }
  
  if (!session) {
    throw new Error('Authentication required. Please sign in to continue.');
  }
  
  return session;
}