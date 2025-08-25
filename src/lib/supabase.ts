import { createClient } from '@supabase/supabase-js'; // Ensure this import is present
import axios from 'axios';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Supabase URL from env:', supabaseUrl);
console.log('Supabase Anon Key from env:', supabaseAnonKey);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Supabase client object:', supabase); // Add this line



export interface OutreachData {
  slug: string;
  'account name': string;
  'account website': string;
  business_summary: string;
  pain_points: string;
  site_issues: string;
  icebreaker: string;
  industry: string;
  'contact name': string;
  'contact email': string;
  'linkedin url': string;
  'facebook url': string;
  other_socials: string;
  owner_pain_point_1: string;
  owner_pain_point_2: string;
  owner_conversion_benefit_1: string;
  owner_conversion_benefit_2: string;
  owner_conversion_benefit_3: string;
  owner_hook_quote: string;
  owner_cta_text: string;
  owner_cta_link: string;
  hero_heading: string;
  hero_subheading: string;
  customer_pain_point_1: string;
  customer_pain_point_2: string;
  customer_conversion_benefit_1: string;
  customer_conversion_benefit_2: string;
  customer_conversion_benefit_3: string;
  customer_benefit_1: string;
  customer_benefit_2: string;
  customer_benefit_3: string;
  process_step_1: string;
  process_step_2: string;
  process_step_3: string;
  customer_hook_quote: string;
  customer_cta_text: string;
  customer_cta_link: string;
  google_rating: number;
  review_1: string;
  review_2: string;
  review_3: string;
  reviewer_1: string;
  reviewer_2: string;
  reviewer_3: string;
  ga_tracking_id?: string;
  Subject: string;
  personalized_email: string;
  subject_follow_up1: string;
  follow_up1: string;
  subject_follow_up2: string;
  follow_up2: string;
  subject_follow_up3: string;
  follow_up3: string;
  subject_follow_up4: string;
  follow_up4: string;
  subject_follow_up5: string;
  follow_up5: string;
}

export interface AuditDemo {
  id: string;
  slug: string;
  business_name: string;
  industry: string;
  owner_name: string;
  email: string;
  owner_pain_point_1: string;
  owner_pain_point_2: string;
  owner_conversion_benefit_1: string;
  owner_conversion_benefit_2: string;
  owner_conversion_benefit_3: string;
  owner_hook_quote: string;
  owner_cta_text: string;
  owner_cta_link: string;
  hero_heading: string;
  hero_subheading: string;
  customer_pain_point_1: string;
  customer_pain_point_2: string;
  customer_conversion_benefit_1: string;
  customer_conversion_benefit_2: string;
  customer_conversion_benefit_3: string;
  customer_benefit_1: string;
  customer_benefit_2: string;
  customer_benefit_3: string;
  process_step_1: string;
  process_step_2: string;
  process_step_3: string;
  customer_hook_quote: string;
  customer_cta_text: string;
  customer_cta_link: string;
  google_rating: number;
  review_1: string;
  review_2: string;
  review_3: string;
  reviewer_1: string;
  reviewer_2: string;
  reviewer_3: string;
  ga_tracking_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessData {
  id: string;
  slug: string;
  business_name: string;
  business_name_clean: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  website: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactRequest {
  id: string;
  slug: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NextStepsQuestion {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  question: string;
  priority: string;
  source_page: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export async function getOutreachData(slug: string): Promise<OutreachData | null> {
  console.log('Fetching outreach data for slug:', slug);
  
  const { data, error } = await supabase
    .from('Outreach')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching outreach data for slug:', slug, error);
    // Don't return null immediately for "not found" errors, let's check what we have
    if (error.code === 'PGRST116') {
      console.log('No record found for slug:', slug);
    }
    return null;
  }

  console.log('Found outreach data:', data);
  return data;
}

export async function getAuditDemo(slug: string): Promise<AuditDemo | null> {
  const { data, error } = await supabase
    .from('audit_demos')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching audit demo:', error);
    return null;
  }

  return data;
}

export async function getBusinessData(slug: string): Promise<BusinessData | null> {
  console.log('Fetching business data for slug:', slug);
  
  const { data, error } = await supabase
    .from('Outreach')
    .select(`
      slug,
      "account name",
      "account website",
      industry,
      "contact name",
      "contact email",
      business_summary
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching business data for slug:', slug, error);
    if (error.code === 'PGRST116') {
      console.log('No outreach record found for slug:', slug);
    }
    return null;
  }

  console.log('Found outreach data, mapping to business data:', data);
  
  // Map Outreach data to BusinessData interface
  const businessData: BusinessData = {
    id: slug, // Use slug as ID since Outreach table doesn't have a separate ID field for this purpose
    slug: data.slug,
    business_name: data['account name'] || '',
    business_name_clean: data['account name'] || '',
    industry: data.industry || '',
    contact_name: data['contact name'] || '',
    contact_email: data['contact email'] || '',
    website: data['account website'] || '',
    description: data.business_summary || '',
    created_at: new Date().toISOString(), // Default since Outreach table doesn't have these fields
    updated_at: new Date().toISOString()
  };
  
  return businessData;
}

export async function submitContactRequest(slug: string, message: string): Promise<ContactRequest | null> {
  const { data, error } = await supabase
    .from('contact_requests')
    .insert({
      slug,
      message: message.trim(),
      is_read: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting contact request:', error);
    return null;
  }

  return data;
}

export async function getContactRequests(): Promise<ContactRequest[]> {
  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact requests:', error);
    return [];
  }

  return data || [];
}

export async function updateContactRequestReadStatus(id: string, isRead: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('contact_requests')
    .update({ 
      is_read: isRead,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating contact request read status:', error);
    return false;
  }

  return true;
}

export async function submitNextStepsQuestion(
  slug: string,
  questionData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    question: string;
    priority?: string;
  }
): Promise<boolean> {
  try {
    console.log('Submitting next steps question for slug:', slug);

    // Prepare the payload for the API request
    const payload = {
      slug,
      name: questionData.name.trim(),
      email: questionData.email.trim(),
      phone: questionData.phone?.trim() || '',
      company: questionData.company?.trim() || '',
      question: questionData.question.trim(),
      priority: questionData.priority || 'medium',
      source_page: 'next-steps',
      is_read: false
    };

    // Define headers, explicitly including 'apikey' and 'Authorization'
    const headers = {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey, // Explicitly set the API key
      'Authorization': `Bearer ${supabaseAnonKey}` // For anon key, the Authorization header also uses the anon key
    };

    // Make the POST request using axios
    const response = await axios.post(
      `${supabaseUrl}/rest/v1/next_steps_questions`, // Construct the full API endpoint URL
      payload, // The data to send in the request body
      { headers } // The custom headers
    );

    // Supabase returns a 201 status code for successful inserts
    if (response.status !== 201) {
      throw new Error(`Failed to submit question: ${response.statusText || response.data}`);
    }

    console.log('Successfully submitted next steps question:', response.data);
    // Return true to indicate successful submission
    return true;
  } catch (error) {
    console.error('Error in submitNextStepsQuestion:', error);
    // Return false to indicate failure
    return false;
  }
}

export async function getNextStepsQuestions(): Promise<NextStepsQuestion[]> {
  const { data, error } = await supabase
    .from('next_steps_questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching next steps questions:', error);
    return [];
  }

  return data || [];
}

export async function updateNextStepsQuestionReadStatus(id: string, isRead: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('next_steps_questions')
    .update({ 
      is_read: isRead,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating next steps question read status:', error);
    return false;
  }

  return true;
}