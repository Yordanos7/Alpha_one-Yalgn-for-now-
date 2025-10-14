"use client";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  MapPin,
  Share2,
  CheckCircle,
  Edit,
  Plus,
  ChevronRight,
  Eye,
  DollarSign,
  Briefcase,
  Zap,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
  Sun,
  ChevronDown,
  Star,
  Flag,
  MessageSquare,
  Calendar,
  User, // Added for "Complete your profile" card
  X, // Added for dismiss button
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Image component for logo

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [portfolioTab, setPortfolioTab] = useState("Published");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const updateUserProfileImage = trpc.user.uploadProfileImage.useMutation();
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    setIsUploading(true);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const { filePath, message } = await response.json();

        if (!response.ok) {
          throw new Error(message || "Upload failed");
        }

        await updateUserProfileImage.mutateAsync(
          {
            filePath,
          },
          {
            onSuccess: (data) => {
              toast.success("Profile image updated successfully!");
              setSelectedFile(null);
              setProfileImage(data.profileImage);
              router.refresh();
            },
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

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
    return null;
  }

  // Updated Placeholder data for demonstration, matching the new design image
  const userProfile = {
    name: session.user.name || "Yohannes",
    faidaIdVerified: true,
    profileCompletion: 75,
    rating: 4.8,
    completedJobs: 12,
    joinedDate: "Jan 2023",
    responseRate: "98%",
    lastActive: "Addis Ababa, Ethiopia",
    image: session.user.image || "/placeholder-avatar.jpg", // Replace with actual image path
    about: {
      description: `UI/UX Designer & Web Developer, crafting user-centered digital experiences.`,
      specialization: "Figma, React, Node.js",
      languages: "Amharic, English",
      experienceLevel: "Mid",
      education: "Bac, Comp Sci, AAU",
      badgesUnlocked: "4/4",
    },
    skills: [
      "UI/UX Design",
      "React.js",
      "Mobile App Design",
      "Wireframing",
      "Prototyping",
      "Webflow",
    ],
    portfolio: [
      {
        id: "1",
        title: "Cuopon Media Banking App/AI",
        image: "https://placehold.co/300x200/E0E0E0/000000?text=Project+1",
        status: "Published",
      },
      {
        id: "2",
        title: "Custom Web Notetaker Site Rederign",
        image: "https://placehold.co/300x200/D0D0D0/000000?text=Project+2",
        status: "Published",
      },
      {
        id: "3",
        title: "Dubizik Data Dashboard Concept",
        image: "https://placehold.co/300x200/C0C0C0/000000?text=Project+3",
        status: "Published",
      },
    ],
    servicesOffered: {
      totalEarnings: "45,0000 ETB",
      coinBalance: 350,
      coins: 197, // Assuming this is the "Coins" value
    },
    reviewsAndRatings: {
      stars: 3, // Placeholder for star rating
      message: "Deliver your first project to collect reviews",
    },
    earningsAnalytics: {
      revitted: 80,
      lifetimeEarnings: "30,000 ETB",
      delivery: "Bitao",
      exilooed: "Exilooed",
      apr: "APR/008",
      graphData: [
        { x: 100, y: 20 },
        { x: 150, y: 40 },
        { x: 200, y: 60 },
        { x: 250, y: 50 },
        { x: 300, y: 70 },
      ],
    },
    verification: {
      faidaIdVerified: true,
      phoneVerified: true,
      emailVerified: true,
      portfolioVerified: true,
    },
  };

  return (
    <div className=" mx-auto px-4 py-8 md:py-12 bg-background">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Top: Profile Summary */}
        <div className="lg:col-span-2 flex items-center gap-6 bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Image
              src="https://www.ethiotelecom.et/wp-content/uploads/2024/04/IMG_9415.jpg" // Assuming Faida logo is here
              alt="Faida Logo"
              width={120}
              height={120}
              className=""
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">Faida</h1>
              <p className="text-sm text-muted-foreground">
                {/* Placeholder for additional text if needed */}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-between ml-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary">
                  <AvatarImage
                    src={profileImage || userProfile.image}
                    alt={userProfile.name}
                  />
                  <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
                </Avatar>
                <button
                  onClick={handleUploadClick}
                  className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-2 hover:bg-gray-600 transition-colors"
                >
                  <Edit className="h-4 w-4 text-white" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                {selectedFile && (
                  <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      disabled={isUploading}
                    >
                      {isUploading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {userProfile.name}
                </h2>
                <Badge variant="secondary" className="w-fit">
                  <CheckCircle className="h-3 w-3 mr-1" /> Faida ID Verified
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                {/* Placeholder for circular progress bar */}
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {userProfile.profileCompletion}%
                </div>
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="30"
                    cx="40"
                    cy="40"
                  />
                  <circle
                    className="text-primary"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 30}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      30 *
                      (1 - userProfile.profileCompletion / 100)
                    }
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="30"
                    cx="40"
                    cy="40"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Top: Complete Profile & Skills Summary */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm">
                Complete your profile to attract more opportunities
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </Card>

          <Card className="p-4 bg-card">
            <CardTitle className="text-lg font-semibold mb-3">
              Skills & Categories
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="default" className="px-3 py-1">
                UI/UX Design
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                React.js
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Profiles with least 5 verified skills get 2x more visibility
            </p>
          </Card>
        </div>
      </div>

      {/* Profile Stats and Action Buttons */}
      <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center text-sm text-muted-foreground mb-6">
          <div className="flex flex-col items-center">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mb-1" />
            <span>Rating</span>
            <span className="font-semibold text-foreground">
              {userProfile.rating}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Briefcase className="h-5 w-5 mb-1" />
            <span>Completed Jobs</span>
            <span className="font-semibold text-foreground">
              {userProfile.completedJobs}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="h-5 w-5 mb-1" />
            <span>Joined Date</span>
            <span className="font-semibold text-foreground">
              {userProfile.joinedDate}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <MessageSquare className="h-5 w-5 mb-1" />
            <span>Response Rate</span>
            <span className="font-semibold text-foreground">
              {userProfile.responseRate} hrs ago
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Flag className="h-5 w-5 mb-1" />
            <span>Last Active</span>
            <span className="font-semibold text-foreground">
              {userProfile.lastActive}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="default" className="min-w-[150px]">
            Edit Profile
          </Button>
          <Button variant="outline" className="min-w-[150px]">
            Share Profile Link
          </Button>
          <Button variant="ghost" className="min-w-[150px] text-primary">
            Preview as Public View
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* About Section */}
          <Card className="p-6 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">About</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-muted-foreground whitespace-pre-line">
              <p className="mb-2">{userProfile.about.description}</p>
              <p className="mb-2">
                <span className="font-semibold text-foreground">
                  Specialization:
                </span>{" "}
                {userProfile.about.specialization}
              </p>
              <p className="mb-2">
                <span className="font-semibold text-foreground">
                  Languages:
                </span>{" "}
                {userProfile.about.languages}
              </p>
              <p className="mb-2">
                <span className="font-semibold text-foreground">
                  Experience level:
                </span>{" "}
                {userProfile.about.experienceLevel}
              </p>
              <p className="mb-4">
                <span className="font-semibold text-foreground">
                  Education:
                </span>{" "}
                {userProfile.about.education}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{userProfile.about.badgesUnlocked} Badges Unlocked</span>
              </div>
            </CardContent>
          </Card>

          {/* Verification & Trust Card */}
          <Card className="p-6 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">
                Verification & Trust
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div className="flex items-center gap-2">
                {userProfile.verification.faidaIdVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 border rounded-full flex items-center justify-center"></div>
                )}
                <span>Faida ID Verified</span>
              </div>
              <div className="flex items-center gap-2">
                {userProfile.verification.phoneVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 border rounded-full flex items-center justify-center"></div>
                )}
                <span>Phone Verified</span>
              </div>
              <div className="flex items-center gap-2">
                {userProfile.verification.emailVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 border rounded-full flex items-center justify-center"></div>
                )}
                <span>Email Verified</span>
              </div>
              <div className="flex items-center gap-2">
                {userProfile.verification.portfolioVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 border rounded-full flex items-center justify-center"></div>
                )}
                <span>Portfolio Verified</span>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Unlock all badges to build client trust
              </Button>
            </CardContent>
          </Card>

          {/* Reviews & Ratings Card */}
          <Card className="p-6 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">
                Reviews & Ratings
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < userProfile.reviewsAndRatings.stars
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <Button variant="outline" className="w-full">
                {userProfile.reviewsAndRatings.message}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills & Categories Card (Detailed) */}
          <Card className="p-6 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">
                Skills & Categories
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card className="p-6 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">
                Portfolio (3)
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProfile.portfolio.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Project
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services Offered Card */}
          <Card className="p-6 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">
                Services Offered (2 Active)
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-2xl font-bold">
                  {userProfile.servicesOffered.totalEarnings}
                </p>
                <p className="text-muted-foreground text-sm">
                  Coin Balance {userProfile.servicesOffered.coinBalance} Coins
                </p>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  {userProfile.servicesOffered.coins} Coins
                </p>
                <Button variant="outline" size="sm">
                  View Project
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Earnings & Analytics Snapshot Card */}
          <Card className="p-6 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">
                Earnings & Analytics Snapshot
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                <div>
                  <p>Revitted</p>
                  <p className="font-semibold text-foreground">
                    {userProfile.earningsAnalytics.revitted}
                  </p>
                </div>
                <div>
                  <p>Lifetime Earnings</p>
                  <p className="font-semibold text-foreground">
                    {userProfile.earningsAnalytics.lifetimeEarnings}
                  </p>
                </div>
                <div>
                  <p>Delivery</p>
                  <p className="font-semibold text-foreground">
                    {userProfile.earningsAnalytics.delivery}
                  </p>
                </div>
                <div>
                  <p>Exilooed</p>
                  <p className="font-semibold text-foreground">
                    {userProfile.earningsAnalytics.exilooed}
                  </p>
                </div>
                <div>
                  <p>APR</p>
                  <p className="font-semibold text-foreground">
                    {userProfile.earningsAnalytics.apr}
                  </p>
                </div>
              </div>
              {/* Placeholder for graph */}
              <div className="w-full h-40 bg-gray-800 rounded-md flex items-center justify-center text-muted-foreground mb-4">
                Graph Placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
