"use client";

import Sidebar from "@/components/sidebar";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Star,
  Award,
  BookOpen,
  Link,
  Loader,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { redirect } from "next/navigation";
import { trpc } from "@/utils/trpc";
import type { AppRouter } from "@Alpha/api/routers";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type UserProfile = RouterOutput["user"]["getPublicUserProfile"]; // Will create this new procedure

export default function IndividualProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { session, isLoading: isSessionLoading } = useSession();

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = trpc.user.getPublicUserProfile.useQuery(
    { userId },
    {
      enabled: !!userId, // Only run query if userId is available
    }
  );

  useEffect(() => {
    // Optional: Redirect if not logged in, or if trying to view own profile as organization
    // For now, we'll allow viewing any individual profile if logged in.
  }, [session, isSessionLoading]);

  if (isSessionLoading || isProfileLoading) {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="profile" />
        <main className="flex-1 p-8 bg-[#202020] flex flex-col items-center justify-center">
          <Loader className="animate-spin" size={48} />
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </main>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="profile" />
        <main className="flex-1 p-8 bg-[#411a1a] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-gray-400">
            Failed to load profile: {profileError.message}
          </p>
        </main>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="profile" />
        <main className="flex-1 p-8 bg-[#202020] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">Profile Not Found</h1>
          <p className="text-gray-400">
            The user profile you are looking for does not exist.
          </p>
        </main>
      </div>
    );
  }

  // Assuming userProfile now contains the data from the backend
  const profileData = userProfile.profile; // Access the nested profile object

  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="profile" />

      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        <ScrollArea className="flex-1 h-full pr-4">
          <Card className="bg-[#2C2C2C] p-8 rounded-lg mb-8">
            <div className="flex items-center mb-6">
              <Avatar className="h-24 w-24 mr-6">
                <AvatarImage
                  src={userProfile.image || "/placeholder-avatar.jpg"}
                  alt={userProfile.name}
                />
                <AvatarFallback>
                  {userProfile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{userProfile.name}</h1>
                {profileData?.headline && (
                  <p className="text-gray-400 text-lg mt-1">
                    {profileData.headline}
                  </p>
                )}
                <div className="flex items-center text-gray-400 mt-2 text-sm">
                  {userProfile.email && (
                    <span className="flex items-center mr-4">
                      <Mail className="mr-1" size={16} /> {userProfile.email}
                    </span>
                  )}
                  {userProfile.location && (
                    <span className="flex items-center">
                      <MapPin className="mr-1" size={16} />{" "}
                      {userProfile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {userProfile.bio && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">About Me</h2>
                <p className="text-gray-300 leading-relaxed">
                  {userProfile.bio}
                </p>
              </div>
            )}

            {profileData?.skills && profileData.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map(
                    (s: UserProfile["profile"]["skills"][number]) => (
                      <span
                        key={s.skill.name}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {s.skill.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {(profileData?.hourlyRate || profileData?.completedJobs) && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.hourlyRate && (
                  <Card className="bg-[#3A3A3A] p-4 rounded-lg">
                    <CardTitle className="text-lg font-semibold text-gray-300 mb-2">
                      Hourly Rate
                    </CardTitle>
                    <CardContent className="text-yellow-500 text-2xl font-bold p-0">
                      {profileData.currency} {profileData.hourlyRate}
                    </CardContent>
                  </Card>
                )}
                {profileData.completedJobs !== undefined && (
                  <Card className="bg-[#3A3A3A] p-4 rounded-lg">
                    <CardTitle className="text-lg font-semibold text-gray-300 mb-2">
                      Completed Jobs
                    </CardTitle>
                    <CardContent className="text-green-500 text-2xl font-bold p-0">
                      {profileData.completedJobs}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {profileData?.experience && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Experience</h2>
                {/* Render structured experience data */}
                <p className="text-gray-300">
                  {JSON.stringify(profileData.experience)}
                </p>
              </div>
            )}

            {profileData?.education && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Education</h2>
                {/* Render structured education data */}
                <p className="text-gray-300">
                  {JSON.stringify(profileData.education)}
                </p>
              </div>
            )}

            {profileData?.portfolio && profileData.portfolio.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileData.portfolio.map(
                    (item: UserProfile["profile"]["portfolio"][number]) => (
                      <Card
                        key={item.id}
                        className="bg-[#3A3A3A] p-4 rounded-lg hover:bg-[#4A4A4A] transition-colors"
                      >
                        <CardTitle className="text-lg font-semibold text-white mb-2">
                          {item.title}
                        </CardTitle>
                        <CardContent className="p-0 text-gray-400 text-sm">
                          <p className="mb-2">{item.description}</p>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center"
                            >
                              <Link className="mr-1" size={16} /> View Project
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
                onClick={() => router.back()}
              >
                Back
              </Button>
            </div>
          </Card>
        </ScrollArea>
      </main>
    </div>
  );
}
