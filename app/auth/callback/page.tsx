"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient();
      // Wait for Supabase to set the session after redirect
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("User not found after authentication. Please try logging in again.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        router.replace("/signup/");
        return;
      }

      if (profile.onboarding_complete) {
        router.replace("/dashboard");
      } else {
        router.replace("/signup/");
      }
    };

    handleAuth();
  }, [router]);

  if (error) {
    return (
      <div style={{ color: "red", padding: 24 }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <p style={{ marginTop: 16 }}>
          <a href="/login">Return to Login</a>
        </p>
      </div>
    );
  }

  return <div>Signing you in...</div>;
} 