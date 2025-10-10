"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import Link from "next/link"; // Ensure next/link is imported

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [portfolioTab, setPortfolioTab] = useState("Published"); // Moved to top-level

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

  // Placeholder data for demonstration
  const userProfile = {
    name: session.user.name || "Yordanos Y.",
    email: session.user.email || "yordanos@example.com",
    image: session.user.image || "/placeholder-avatar.jpg",
    location: "Debre Mark'os, Ethiopia",
    role: "Freelancer",
    isVerified: true,
    jobTitle:
      "Full-Stack Web Developer | React, Next.js, Node.js, Prisma/MySQL",
    hourlyRate: "10.00",
    description: `I'm Yordanos, a Full-Stack Developer with 3+ years of hands-on experience building modern, scalable, and secure applications. My expertise spans front-end frameworks, back-end systems, databases, DevOps, AI integrations, and workflow automation. I ensure clean, maintainable, and production-ready solutions.
    I specialize in developing AI-powered web apps and delivering high-performance, user-friendly, and SEO-optimized applications. My focus is always on clean architecture, efficiency, and solving problems that...`,
    totalEarnings: 5,
    totalJobs: 1,
    connects: 197,
    availabilityBadge: false,
    boostProfile: false,
    portfolio: [
      {
        id: "1",
        title: "Responsive Financial Cooperative Website - Soser Union",
        image: "https://placehold.co/300x200/E0E0E0/000000?text=Project+1",
        status: "Published",
      },
      {
        id: "2",
        title: "E-Commerce Plant Shop Web App - DMU University",
        image: "https://placehold.co/300x200/D0D0D0/000000?text=Project+2",
        status: "Published",
      },
      {
        id: "3",
        title: "BrowseMind - Open Source Chrome Extension",
        image: "https://placehold.co/300x200/C0C0C0/000000?text=Project+3",
        status: "Published",
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          {/* User Info Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.image} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {userProfile.name}
                  {userProfile.isVerified && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </h2>
                <p className="text-muted-foreground flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {userProfile.location}
                </p>
                <p className="text-muted-foreground text-sm">
                  {userProfile.role}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mb-4">
              <Button variant="outline" size="sm">
                See public view
              </Button>
              <Button variant="default" size="sm">
                Profile settings
              </Button>
            </div>
            <div className="flex justify-end text-muted-foreground text-sm">
              <Share2 className="h-4 w-4 mr-1" /> Share
            </div>
          </Card>

          {/* View Profile Card */}
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">
                View profile
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Draft</Badge>
                <Badge variant="secondary">
                  {userProfile.jobTitle.split("|")[1]?.trim() ||
                    "Full Stack Development"}
                </Badge>
              </div>
              <Link
                href="#"
                className="flex items-center text-primary hover:underline text-sm"
              >
                All work <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>

          {/* Earnings and Jobs Card */}
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">
                  ${userProfile.totalEarnings}
                </p>
                <p className="text-muted-foreground text-sm">Total earnings</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{userProfile.totalJobs}</p>
                <p className="text-muted-foreground text-sm">Total jobs</p>
              </div>
            </div>
          </Card>

          {/* Promote with Ads Card */}
          <Card className="p-6">
            <CardTitle className="text-xl font-semibold mb-4">
              Promote with ads
            </CardTitle>
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="availability-badge">Availability badge</Label>
              <Switch
                id="availability-badge"
                checked={userProfile.availabilityBadge}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="boost-profile">Boost your profile</Label>
              <Switch id="boost-profile" checked={userProfile.boostProfile} />
            </div>
          </Card>

          {/* Connects Card */}
          <Card className="p-6">
            <CardTitle className="text-xl font-semibold mb-4">
              Connects: {userProfile.connects}
            </CardTitle>
            <div className="flex justify-between text-sm">
              <Link href="#" className="text-primary hover:underline">
                View details
              </Link>
              <Link href="#" className="text-primary hover:underline">
                Buy Connects
              </Link>
            </div>
          </Card>

          {/* Video Introduction Card */}
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">
                Video introduction
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 text-muted-foreground text-sm">
              Add a video to stand out.
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Job Title and Description */}
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-2xl font-bold">
                {userProfile.jobTitle}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 mb-4">
              <div className="flex items-center gap-2 text-lg font-semibold mb-2">
                <DollarSign className="h-5 w-5" />
                {userProfile.hourlyRate}/hr
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Edit className="h-4 w-4" />
                </Button>
                <LinkIcon className="h-4 w-4 ml-2" />{" "}
                {/* Placeholder for link icon */}
              </div>
              <p className="text-muted-foreground whitespace-pre-line">
                {userProfile.description}
              </p>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">Portfolio</CardTitle>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex border-b mb-4">
                <Button
                  variant="ghost"
                  className={`rounded-none border-b-2 ${
                    portfolioTab === "Published"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground"
                  }`}
                  onClick={() => setPortfolioTab("Published")}
                >
                  Published
                </Button>
                <Button
                  variant="ghost"
                  className={`rounded-none border-b-2 ${
                    portfolioTab === "Drafts"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground"
                  }`}
                  onClick={() => setPortfolioTab("Drafts")}
                >
                  Drafts
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProfile.portfolio
                  .filter((item) => item.status === portfolioTab)
                  .map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-32 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.status}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
