"use client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm key="signIn" onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm key="signUp" onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
