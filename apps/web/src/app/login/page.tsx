"use client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

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
