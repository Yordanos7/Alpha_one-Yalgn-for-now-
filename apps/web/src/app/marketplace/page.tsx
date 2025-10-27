"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import Link from "next/link"; // Import Link for navigation
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Star,
  MessageSquare,
  Plus,
  X, // For closing the modal
} from "lucide-react";
import { trpc } from "@/utils/trpc"; // Import trpc

// Define Listing interface based on the backend type
interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: "ETB" | "USD";
  deliveryDays?: number;
  categoryId?: string;
  images: string[];
  videos?: string[];
  tags: string[];
  isPublished: boolean;
  rating?: number; // Added for display purposes, not directly from schema
  reviewCount?: number; // Added for display purposes, not directly from schema
  provider: {
    id: string;
    name: string;
    image?: string;
    accountType: "INDIVIDUAL" | "ORGANIZATION";
  };
  createdAt: Date;
  updatedAt: Date;
}

const ListingCard = ({ listing }: { listing: Listing }) => {
  const isVideo = (url: string) => {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  return (
    <Link href={`/marketplace/${listing.id}`}>
      <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-[#3A3A3A] transition-colors">
        {isVideo(listing.videos?.[0] || "") ? (
          <video
            src={listing.videos?.[0]}
            className="w-32 h-32 object-cover mb-4 rounded-lg"
            controls
            autoPlay
            loop
            muted
          />
        ) : (
          <img
            src={listing.images[0] || "https://via.placeholder.com/150"}
            alt={listing.title}
            className="w-32 h-32 object-cover mb-4 rounded-lg"
          />
        )}
        <p className="text-lg font-semibold text-center mb-1">
          {listing.title}
        </p>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={
                i < Math.floor(listing.rating || 0)
                  ? "text-yellow-500"
                  : "text-gray-500"
              }
              size={16}
              fill={
                i < Math.floor(listing.rating || 0) ? "currentColor" : "none"
              }
            />
          ))}
          <span className="text-sm text-gray-400 ml-2">
            ({listing.rating?.toFixed(1) || "N/A"})
          </span>
        </div>
        <p className="text-md font-bold text-green-500 mb-4">
          {listing.currency} {listing.price.toFixed(2)}
        </p>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-6 py-2">
          View Details
        </Button>
      </Card>
    </Link>
  );
};

export default function MarketplacePage() {
  const {
    data: listingsData,
    isPending,
    error,
  } = trpc.listing.getAll.useQuery();

  if (isPending) {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="marketplace" />
        <main className="flex-1 p-8 bg-[#202020] flex flex-col items-center justify-center">
          <p className="text-gray-400">Loading listings...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#202020] text-white">
        <Sidebar currentPage="marketplace" />
        <main className="flex-1 p-8 bg-[#411a1a] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-gray-400">
            Failed to load listings: {error.message}
          </p>
        </main>
      </div>
    );
  }

  const listings = listingsData?.listings || [];

  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="marketplace" />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src="/assets/logo.png"
              alt="Yalegn Marketplace"
              className="h-8 mr-2"
            />
            <span className="text-xl font-bold text-gray-200">
              Yalegn Marketplace
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-4 py-2">
              Products
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Search and Filter Bar */}
        <div className="flex items-center space-x-4 mb-8 bg-[#2C2C2C] p-3 rounded-lg">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-lg bg-[#3A3A3A] border-none text-white focus:ring-0 focus:outline-none w-full"
            />
          </div>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Category <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Price Range <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Shipping Location <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Estimated Delivery <ChevronDown className="ml-1" size={16} />
          </Button>
          <Link href="/freelancers">
            <Button className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-gray-300 font-semibold rounded-lg px-4 py-2 flex items-center">
              <ShoppingCart className="mr-2" size={16} />
              Freelancers
            </Button>
          </Link>
        </div>

        {/* Content area for product grid and featured freelancers */}
        <div className="flex flex-1 space-x-8">
          {/* Product Grid */}
          <div className="flex-1 grid grid-cols-3 gap-6">
            {listings.map((listing: Listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Featured Freelancers Sidebar */}
          <Card className=""></Card>
        </div>
      </main>
    </div>
  );
}
