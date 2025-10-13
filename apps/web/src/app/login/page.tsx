"use client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center pt-8">
        <Loader />
      </div>
    );
  }

  if (session?.user) {
    return null; // Or a loading indicator, as the redirect will happen
  }

  return showSignIn ? (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 bg-black">
      <SignInForm key="signIn" onSwitchToSignUp={() => setShowSignIn(false)} />
    </div>
  ) : (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 bg-black">
      <SignUpForm key="signUp" onSwitchToSignIn={() => setShowSignIn(true)} />
    </div>
  );
}
