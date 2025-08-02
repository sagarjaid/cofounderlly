import { createClient } from "./supabase-client";

export const signInWithLinkedIn = async () => {
  const supabase = createClient();
  let redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "http://localhost:3000/auth/callback";
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "linkedin_oidc",
    options: { redirectTo },
  });
  if (error) throw error;
};

export const signOut = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const getCurrentUser = async () => {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error("Error getting current user:", error)
    return null
  }
  return user
}

export const getCurrentProfile = async () => {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) return null

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error getting profile:", error)
    return null
  }

  return profile
}

export const updateProfile = async (profileData: Partial<import("./supabase-client").Profile>) => {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!user) throw new Error("No user logged in");
  const { error } = await supabase
    .from("profiles")
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (error) throw error;
};
