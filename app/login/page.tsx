"use client";
import { Button } from "@/components/ui/button";
import { signInWithLinkedIn } from "@/lib/auth";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkedInSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithLinkedIn();
    } catch (error) {
      let message = "Unknown error";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      alert("LinkedIn sign in error: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleLinkedInSignIn} disabled={isLoading}>
        {isLoading ? "Connecting..." : "Continue with LinkedIn"}
      </Button>
    </div>
  );
}
