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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListingForm } from "@/components/listing-form"; // Import ListingForm
import { ReviewListingDialog } from "@/components/review-listing-dialog";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession(); // here the method useSession is used to check if the user is logged in or not and i come form the authClient of auth-client.ts better auth instance
  const [portfolioTab, setPortfolioTab] = useState("Published");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isListingFormOpen, setIsListingFormOpen] = useState(false); // State for controlling the listing form modal
  const [isReviewListingDialogOpen, setIsReviewListingDialogOpen] =
    useState(false);
  const [newlyCreatedListing, setNewlyCreatedListing] = useState<any | null>(
    null
  );

  const {
    data: userProfileData,
    isPending: isProfilePending,
    refetch: refetchUserProfile,
  } = trpc.user.getUserProfile.useQuery();

  // the above would be writen like this if i were use REST API
  // const { data: userProfileData, isLoading: isProfileLoading, refetch: refetchUserProfile } = useQuery('userProfile', async () => {
  //   const response = await fetch('/api/user/profile');

  const {
    data: userListings,
    isPending: isListingsPending,
    refetch: refetchUserListings,
  } = trpc.listing.getByUserId.useQuery(
    { userId: userProfileData?.id || "" },
    { enabled: !!userProfileData?.id }
  ); // the parameter passed to the query is userId gotten from userProfileData if it exists

  const createListingMutation = trpc.listing.create.useMutation(); // Mutation for creating a new listing
  const updateListingMutation = trpc.listing.update.useMutation(); // Mutation for updating a listing

  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    location: "",
    headline: "",
    hourlyRate: 0,
    currency: "ETB",
    availability: "",
    education: "",
    experience: "",
  });
  const [skillsForm, setSkillsForm] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  const [isFreelancerOpenToWork, setIsFreelancerOpenToWork] = useState(
    userProfileData?.isOpenToWork || false
  );
  const updateIsOpenToWorkMutation = trpc.user.updateIsOpenToWork.useMutation();

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push("/login");
    }
  }, [isSessionPending, session, router]);

  useEffect(() => {
    if (userProfileData) {
      setProfileForm({
        name: userProfileData.name || "",
        bio: userProfileData.bio || "",
        location: userProfileData.location || "",
        headline: "",
        hourlyRate: 0,
        currency: "ETB",
        availability: "",
        education: "{}",
        experience: "{}",
      });
      setSkillsForm([]);
      setIsFreelancerOpenToWork(userProfileData.isOpenToWork || false);
    }
  }, [userProfileData]);

  const handleToggleOpenToWork = async (checked: boolean) => {
    try {
      await updateIsOpenToWorkMutation.mutateAsync(
        { isOpenToWork: checked },
        {
          onSuccess: () => {
            toast.success(
              `Status updated to 'Open to Work': ${checked ? "Yes" : "No"}`
            );
            refetchUserProfile(); // Refetch to update session and UI
          },
        }
      );
    } catch (error) {
      console.error("Error updating 'open to work' status:", error);
      toast.error("Failed to update 'open to work' status.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0] ?? null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const updateUserProfileImage = trpc.user.uploadProfileImage.useMutation();
  const [isUploading, setIsUploading] = useState(false);

  // this is for handling profile image upload and saving to user:)
  const handleSaveProfileImage = async () => {
    setIsUploading(true);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const { path: filePath, message } = await response.json();

        if (!response.ok) {
          throw new Error(message || "Upload failed");
        }

        await updateUserProfileImage.mutateAsync(
          {
            filePath,
          },
          {
            onSuccess: () => {
              toast.success("Profile image updated successfully!");
              setSelectedFile(null);
              refetchUserProfile(); // Refetch user profile to update image
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

  const updateProfileMutation = trpc.user.updateProfile.useMutation();
  const updateSkillsMutation = trpc.user.updateSkills.useMutation();

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        name: profileForm.name,
        bio: profileForm.bio,
        location: profileForm.location,
        headline: profileForm.headline,
        hourlyRate: profileForm.hourlyRate,
        currency: profileForm.currency as "ETB" | "USD",
        availability: profileForm.availability,
        education: JSON.parse(profileForm.education),
        experience: JSON.parse(profileForm.experience),
      });
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
      refetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skillsForm.includes(newSkillInput.trim())) {
      setSkillsForm([...skillsForm, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsForm(skillsForm.filter((skill) => skill !== skillToRemove));
  };

  const handleSaveSkills = async () => {
    try {
      await updateSkillsMutation.mutateAsync({ skills: skillsForm });
      toast.success("Skills updated successfully!");
      setIsEditingSkills(false);
      refetchUserProfile();
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Error updating skills. Please try again.");
    }
  };

  if (isSessionPending || isProfilePending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-8 w-64" />
      </div>
    );
  }

  if (!session || !userProfileData || isListingsPending) {
    return null;
  }

  const user = userProfileData;
  const profile = userProfileData.profile;
  const verification = userProfileData.verification;

  const handleCreateListing = async (data: any) => {
    console.log(
      "Data being sent to createListing mutation:",
      JSON.stringify(data, null, 2)
    );
    try {
      const createdListing = await createListingMutation.mutateAsync(data);
      toast.success("Listing created successfully!");
      setIsListingFormOpen(false);
      setNewlyCreatedListing(createdListing);
      setIsReviewListingDialogOpen(true);
      refetchUserListings(); // Refetch user listings to update the displayed list
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Error creating listing. Please try again.");
    }
  };

  const handlePublishListing = async (listingId: string) => {
    try {
      const updatedListing = await updateListingMutation.mutateAsync({
        id: listingId,
        isPublished: true,
      });
      console.log("Listing updated after publish:", updatedListing);
      toast.success("Listing published successfully!");
      await refetchUserListings(); // Ensure refetch completes before logging
      console.log("User listings after refetch:", userListings);
    } catch (error) {
      console.error("Error publishing listing:", error);
      toast.error("Error publishing listing. Please try again.");
    }
  };

  const isVideo = (url: string) => {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  // Placeholder data for demonstration, matching the new design image
  const userProfile = {
    name: user.name || "Yohannes",
    faidaIdVerified: verification?.status === "APPROVED",
    isOpenToWork: user.isOpenToWork || false, // Added isOpenToWork
    profileCompletion: 75, // This will need to be calculated dynamically
    rating: 4.8, // Placeholder
    completedJobs: profile?.completedJobs || 0,
    joinedDate: new Date(user.createdAt).toLocaleDateString(),
    responseRate: "98%", // Placeholder
    lastActive: user.location || "Addis Ababa, Ethiopia",
    image: user.image || "/placeholder-avatar.jpg",
    about: {
      description:
        user.bio ||
        `UI/UX Designer & Web Developer, crafting user-centered digital experiences.`,
      specialization: profile?.headline || "Figma, React, Node.js", // Using headline for specialization
      languages: user.languages?.join(", ") || "Amharic, English", // Use optional chaining
      experienceLevel: "Mid", // Placeholder
      education:
        JSON.parse((profile?.education as string) || "{}").degree ||
        "Bac, Comp Sci, AAU",
      badgesUnlocked: "4/4", // Placeholder
    },
    skills:
      profile?.skills?.map((s: { skill: { name: string } }) => s.skill.name) ||
      [],
    portfolio: profile?.portfolio || [],
    servicesOffered: {
      totalEarnings: "45,0000 ETB", // Placeholder
      coinBalance: user.coins || 0,
      coins: user.coins || 0, // Assuming this is the "Coins" value
    },
    reviewsAndRatings: {
      stars: 3, // Placeholder for star rating
      message: "Deliver your first project to collect reviews",
    },
    earningsAnalytics: {
      revitted: 80, // Placeholder
      lifetimeEarnings: "30,000 ETB", // Placeholder
      delivery: "Bitao", // Placeholder
      exilooed: "Exilooed", // Placeholder
      apr: "APR/008", // Placeholder
      graphData: [
        { x: 100, y: 20 },
        { x: 150, y: 40 },
        { x: 200, y: 60 },
        { x: 250, y: 50 },
        { x: 300, y: 70 },
      ],
    },
    verification: {
      faidaIdVerified: verification?.status === "APPROVED",
      phoneVerified: false, // Placeholder
      emailVerified: !!user.email,
      portfolioVerified: false, // Placeholder
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
              priority
              style={{ height: "auto" }}
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
                  <AvatarImage src={userProfile.image} alt={userProfile.name} />
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
                      onClick={handleSaveProfileImage}
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
            <CardTitle className="text-lg font-semibold mb-3 flex justify-between items-center">
              Skills & Categories
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingSkills(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              {userProfile.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="default" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Profiles with at least 5 verified skills get 2x more visibility
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
              {userProfile.responseRate}
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
          <Button
            variant="default"
            className="min-w-[150px]"
            onClick={() => setIsEditingProfile(true)}
          >
            Edit Profile
          </Button>
          <Button variant="outline" className="min-w-[150px]">
            Share Profile Link
          </Button>
          <Button variant="ghost" className="min-w-[150px] text-primary">
            Preview as Public View
          </Button>

          {/* New "Open to Work" Switch */}
          <div className="flex items-center space-x-2 min-w-[150px] justify-center">
            <Switch
              id="open-to-work"
              checked={isFreelancerOpenToWork}
              onCheckedChange={handleToggleOpenToWork}
              disabled={updateIsOpenToWorkMutation.isPending}
            />
            <Label htmlFor="open-to-work">Open to Work</Label>
          </div>
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingProfile(true)}
                >
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingSkills(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill: string, index: number) => (
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
                Portfolio ({userProfile.portfolio.length})
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
                {userProfile.portfolio.map(
                  (item: { id: string; media: string[]; title: string }) => (
                    <Card key={item.id} className="overflow-hidden">
                      <img
                        src={
                          item.media[0] ||
                          "https://placehold.co/300x200/E0E0E0/000000?text=Project"
                        }
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
                  )
                )}
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

          {/* My Products & Services Section */}
          <Card className="p-6 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 mb-4">
              <CardTitle className="text-xl font-semibold">
                My Products & Services
              </CardTitle>
              <Dialog
                open={isListingFormOpen}
                onOpenChange={setIsListingFormOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-4 py-2 flex items-center">
                    <Plus className="mr-2" size={16} /> Post New Product/Service
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="
  bg-[#2c2c2c] 
  p-8 
  w-full 
  h-screen 
  max-w-full 
  rounded-none 
  overflow-y-auto 
  flex 
  flex-col
"
                >
                  <DialogHeader>
                    <DialogTitle>Create a new listing</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to post a new product or service.
                    </DialogDescription>
                  </DialogHeader>
                  <ListingForm
                    onSubmit={handleCreateListing}
                    onCancel={() => setIsListingFormOpen(false)}
                    isSubmitting={createListingMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0 text-muted-foreground ">
              {userListings && userListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {userListings.map(
                    (
                      listing: {
                        id: string;
                        title: string;
                        description: string;
                        price: number;
                        currency: string;
                        images: string[];
                        videos: string[];
                        tags: string[];
                        isPublished: boolean;
                      },
                      index: number
                    ) => (
                      <Card
                        key={listing.id}
                        className="bg-[#2C2C2C] p-4 rounded-lg"
                      >
                        <h3 className="font-semibold text-white">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {listing.description}
                        </p>
                        <p className="text-green-500 font-bold">
                          {listing.price} {listing.currency}
                        </p>
                        {(listing.images?.length > 0 ||
                          listing.videos?.length > 0) && (
                          <div className="mt-2 w-full h-32 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                            {listing.videos && listing.videos.length > 0 ? (
                              <video
                                src={listing.videos[0]}
                                className="w-full h-full object-cover"
                                controls
                                muted
                                autoPlay
                                loop
                              >
                                Your browser does not support the video tag.
                              </video>
                            ) : listing.images && listing.images.length > 0 ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {listing.tags.map((tag: string, tagIndex: number) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {listing.isPublished ? "Published" : "Draft"}
                        </p>
                        {!listing.isPublished && (
                          <Button
                            variant="default"
                            size="sm"
                            className="mt-2 bg-blue-500 hover:bg-blue-600"
                            onClick={() => handlePublishListing(listing.id)}
                          >
                            Sell to Market
                          </Button>
                        )}
                      </Card>
                    )
                  )}
                </div>
              ) : (
                <p>You haven't posted any products or services yet.</p>
              )}
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

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    name: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="headline" className="text-right">
                Headline
              </Label>
              <Input
                id="headline"
                value={profileForm.headline}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, headline: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={profileForm.location}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, location: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hourlyRate" className="text-right">
                Hourly Rate
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                value={profileForm.hourlyRate}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    hourlyRate: parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency
              </Label>
              <Select
                value={profileForm.currency}
                onValueChange={(value) =>
                  setProfileForm({ ...profileForm, currency: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETB">ETB</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availability" className="text-right">
                Availability
              </Label>
              <Input
                id="availability"
                value={profileForm.availability}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    availability: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="education" className="text-right">
                Education (JSON)
              </Label>
              <Textarea
                id="education"
                value={profileForm.education}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, education: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experience" className="text-right">
                Experience (JSON)
              </Label>
              <Textarea
                id="experience"
                value={profileForm.experience}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, experience: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Skills Dialog */}
      <Dialog open={isEditingSkills} onOpenChange={setIsEditingSkills}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Skills</DialogTitle>
            <DialogDescription>Add or remove skills.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-wrap gap-2">
              {skillsForm.map((skill: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-1"
                >
                  {skill}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add new skill"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddSkill();
                  }
                }}
              />
              <Button onClick={handleAddSkill}>Add</Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSaveSkills}
              disabled={updateSkillsMutation.isPending}
            >
              {updateSkillsMutation.isPending ? "Saving..." : "Save skills"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
