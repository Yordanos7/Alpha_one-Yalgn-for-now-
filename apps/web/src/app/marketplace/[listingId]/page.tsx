"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Plus, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: "ETB" | "USD";
  deliveryDays?: number;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  images: string[];
  tags: string[];
  isPublished: boolean;
  rating?: number;
  reviewCount?: number;
  provider: {
    id: string;
    name: string;
    image?: string;
    accountType: "INDIVIDUAL" | "ORGANIZATION";
    location?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function ListingDetailPage({
  params,
}: {
  params: { listingId: string };
}) {
  const router = useRouter();
  const { listingId } = params;

  const {
    data: listingData,
    isPending,
    error,
  } = trpc.listing.getById.useQuery({ id: listingId });

  const listing = listingData as Listing;

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-8 w-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12">
        Listing not found.
      </div>
    );
  }

  const isVideo = (url: string) => {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-background text-foreground">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        &larr; Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media and Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Media Display */}
          <Card className="p-4 bg-card rounded-lg shadow-sm">
            {listing.images &&
            listing.images.length > 0 &&
            listing.images[currentMediaIndex] ? (
              <div className="relative w-full h-[400px] bg-gray-800 rounded-md overflow-hidden">
                {isVideo(listing.images[currentMediaIndex]) ? (
                  <video
                    src={listing.images[currentMediaIndex]}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={listing.images[currentMediaIndex]}
                    alt={listing.title}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                )}
              </div>
            ) : (
              <div className="w-full h-[400px] bg-gray-800 rounded-md flex items-center justify-center text-muted-foreground">
                No media available
              </div>
            )}

            {/* Media Scroll Effect (Thumbnails) */}
            {listing.images && listing.images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                {listing.images.map((mediaUrl, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer border-2 ${
                      index === currentMediaIndex
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentMediaIndex(index)}
                  >
                    {isVideo(mediaUrl) ? (
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={mediaUrl}
                        alt={`Thumbnail ${index + 1}`}
                        width={96}
                        height={96}
                        objectFit="cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Description */}
          <Card className="p-6 bg-card rounded-lg shadow-sm">
            <CardTitle className="text-xl font-semibold mb-4">
              Description
            </CardTitle>
            <CardContent className="p-0 text-muted-foreground whitespace-pre-line">
              <p>{listing.description}</p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="p-6 bg-card rounded-lg shadow-sm">
            <CardTitle className="text-xl font-semibold mb-4">Tags</CardTitle>
            <CardContent className="p-0">
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Seller Info and Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Listing Summary */}
          <Card className="p-6 bg-card rounded-lg shadow-sm">
            <CardTitle className="text-2xl font-bold mb-2">
              {listing.title}
            </CardTitle>
            <p className="text-3xl font-bold text-primary mb-4">
              {listing.currency} {listing.price.toFixed(2)}
            </p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(listing.rating || 0)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({listing.rating?.toFixed(1) || "N/A"})
              </span>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-6 py-2 flex items-center mb-2">
              <Plus className="mr-2" size={16} /> Add to Cart
            </Button>
            <Button variant="outline" className="w-full flex items-center">
              <MessageSquare className="mr-2" size={16} /> Message Seller
            </Button>
          </Card>

          {/* Seller Information */}
          <Card className="p-6 bg-card rounded-lg shadow-sm">
            <CardTitle className="text-xl font-semibold mb-4">
              About the Seller
            </CardTitle>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={listing.provider.image || "/placeholder-avatar.jpg"}
                  alt={listing.provider.name}
                />
                <AvatarFallback>{listing.provider.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {listing.provider.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {listing.provider.accountType === "INDIVIDUAL"
                    ? "Individual Seller"
                    : "Organization"}
                </p>
                {listing.provider.location && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{listing.provider.location}</span>
                  </div>
                )}
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Seller Profile
            </Button>
          </Card>

          {/* Other details like delivery days, category etc. */}
          <Card className="p-6 bg-card rounded-lg shadow-sm">
            <CardTitle className="text-xl font-semibold mb-4">
              Additional Details
            </CardTitle>
            <CardContent className="p-0 space-y-2 text-muted-foreground">
              {listing.deliveryDays && (
                <p>
                  <span className="font-semibold text-foreground">
                    Estimated Delivery:
                  </span>{" "}
                  {listing.deliveryDays} days
                </p>
              )}
              {listing.category && (
                <p>
                  <span className="font-semibold text-foreground">
                    Category:
                  </span>{" "}
                  {listing.category.name}
                </p>
              )}
              <p>
                <span className="font-semibold text-foreground">
                  Posted On:
                </span>{" "}
                {new Date(listing.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
