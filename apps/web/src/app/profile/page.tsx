"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-8 w-64" />
      </div>
    );
  }

  if (!session) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome, {session.user.name}!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This is your profile organization page. Here you can manage all your
        personal settings and information.
      </p>

      {/* Placeholder for profile sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <nav className="space-y-2">
            <a
              href="#"
              className="block p-3 rounded-md bg-muted hover:bg-accent"
            >
              Personal Information
            </a>
            <a href="#" className="block p-3 rounded-md hover:bg-accent">
              Security Settings
            </a>
            <a href="#" className="block p-3 rounded-md hover:bg-accent">
              Notification Preferences
            </a>
            <a href="#" className="block p-3 rounded-md hover:bg-accent">
              Connected Accounts
            </a>
          </nav>
        </div>
        <div className="md:col-span-2 bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <p className="text-muted-foreground">
            Here you can edit your name, email, and other personal details.
          </p>
          {/* More detailed forms/components will go here */}
        </div>
      </div>
    </div>
  );
}
