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

// Define a mock Listing interface based on schema.prisma
interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: "ETB" | "USD";
  deliveryDays?: number;
  categoryId?: string;
  images: string[];
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

// Mock listings data
const mockListings: Listing[] = [
  {
    id: "lst1",
    title: "Custom Logo Design",
    description: "Professional logo design service for your brand.",
    price: 150.0,
    currency: "USD",
    deliveryDays: 5,
    categoryId: "cat2",
    images: ["https://via.placeholder.com/150/0000FF/FFFFFF?text=Logo1"],
    tags: ["logo", "design", "branding"],
    isPublished: true,
    rating: 4.8,
    reviewCount: 25,
    provider: {
      id: "user1",
      name: "Freelancer A",
      image: "https://github.com/shadcn.png",
      accountType: "INDIVIDUAL",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "lst2",
    title: "E-commerce Website Development",
    description: "Build a fully functional e-commerce website.",
    price: 1200.0,
    currency: "USD",
    deliveryDays: 30,
    categoryId: "cat1",
    images: ["https://via.placeholder.com/150/FF0000/FFFFFF?text=Web1"],
    tags: ["web development", "e-commerce", "react"],
    isPublished: true,
    rating: 4.5,
    reviewCount: 10,
    provider: {
      id: "org1",
      name: "Org Solutions",
      image: "https://github.com/shadcn.png",
      accountType: "ORGANIZATION",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "lst3",
    title: "Social Media Marketing Package",
    description: "Boost your online presence with our marketing package.",
    price: 300.0,
    currency: "USD",
    deliveryDays: 7,
    categoryId: "cat3",
    images: ["https://via.placeholder.com/150/00FF00/FFFFFF?text=Social1"],
    tags: ["marketing", "social media", "digital"],
    isPublished: true,
    rating: 4.2,
    reviewCount: 15,
    provider: {
      id: "user2",
      name: "Freelancer B",
      image: "https://github.com/shadcn.png",
      accountType: "INDIVIDUAL",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "lst4",
    title: "Mobile App UI/UX Design",
    description: "Intuitive and modern UI/UX design for mobile applications.",
    price: 500.0,
    currency: "USD",
    deliveryDays: 10,
    categoryId: "cat2",
    images: ["https://via.placeholder.com/150/FFFF00/000000?text=UIUX1"],
    tags: ["ui/ux", "mobile app", "design"],
    isPublished: true,
    rating: 4.9,
    reviewCount: 30,
    provider: {
      id: "user3",
      name: "Freelancer C",
      image: "https://github.com/shadcn.png",
      accountType: "INDIVIDUAL",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const ListingCard = ({ listing }: { listing: Listing }) => (
  <Link href={`/marketplace/${listing.id}`}>
    <Card className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-[#3A3A3A] transition-colors">
      <img
        src={listing.images[0] || "https://via.placeholder.com/150"}
        alt={listing.title}
        className="w-32 h-32 object-cover mb-4 rounded-lg"
      />
      <p className="text-lg font-semibold text-center mb-1">{listing.title}</p>
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
            fill={i < Math.floor(listing.rating || 0) ? "currentColor" : "none"}
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

export default function MarketplacePage() {
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
            {mockListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Featured Freelancers Sidebar */}
          <Card className="w-72 bg-[#2C2C2C] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Featured Freelancers</h3>
            <div className="space-y-4">
              {/* Freelancer Card 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sarah J</p>
                    <p className="text-sm text-gray-400">Graphic Designer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
              {/* Freelancer Card 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sarah J</p>
                    <p className="text-sm text-gray-400">Graphic Designer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
              {/* Freelancer Card 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">David Chen</p>
                    <p className="text-sm text-gray-400">Web Developer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
