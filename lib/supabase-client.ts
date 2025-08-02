import { createClientComponentClient, type SupabaseClient } from "@supabase/auth-helpers-nextjs";

let supabaseClient: SupabaseClient | null = null;

export const createClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient();
  }
  return supabaseClient;
};

// Types for our database
export interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  linkedin_url: string | null
  avatar_url: string | null
  location: string | null
  timezone: string | null
  founder_type: "hacker" | "hipster" | "hustler" | null
  looking_for: string[] | null
  weekly_hours: string | null
  has_idea: string | null
  idea_description: string | null
  looking_to_join: boolean
  calendar_type: string | null
  calendar_url: string | null
  bio: string | null
  skills: string[] | null
  is_online: boolean
  match_score: number | null
  response_rate: string | null
  avg_response_time: string | null
  member_since: string | null
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}
