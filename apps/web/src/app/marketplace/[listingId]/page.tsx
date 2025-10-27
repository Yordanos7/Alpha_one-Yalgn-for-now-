"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MessageSquare,
  Plus,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

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
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (listing && listing.images && listing.images.length > 0) {
      setCurrentMediaIndex(0); // Reset to first image when listing changes
    }
  }, [listing]);

  useEffect(() => {
    console.log("Listing images:", listing?.images);
    console.log("Current media index:", currentMediaIndex);
    if (listing?.images && listing.images.length > 0) {
      console.log("Current media URL:", listing.images[currentMediaIndex]);
      console.log("Is video:", isVideo(listing.images[currentMediaIndex]));
    }
  }, [listing, currentMediaIndex]);

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

  console.log("Rendering listing:", listing);
  console.log("Listing images array:", listing.images);
  console.log("videoExtensions check:", isVideo(listing.images[0] || ""));
  return (
    <main className=" mx-auto px-4 py-8 md:py-12 bg-background text-foreground">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        &larr; Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Media Display and Thumbnails */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Media Display with Navigation */}
          <Card className="p-4 bg-card rounded-lg shadow-sm relative">
            {listing.images && listing.images.length > 0 ? (
              <div className="relative w-full h-[400px] bg-gray-800 rounded-md overflow-hidden">
                {isVideo(listing.images[currentMediaIndex]) ? (
                  <video
                    src={listing.images[currentMediaIndex]}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain"
                    onError={(e) =>
                      console.error("Video error:", e.currentTarget.error)
                    }
                  />
                ) : (
                  <Image
                    src={
                      listing.images[currentMediaIndex] ||
                      "/placeholder-image.jpg"
                    } // Fallback for Image src
                    alt={listing.title}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                    onError={(e) =>
                      console.error("Image error:", e.currentTarget.src)
                    }
                  />
                )}
                {listing.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() =>
                        setCurrentMediaIndex((prev) =>
                          prev === 0 ? listing.images.length - 1 : prev - 1
                        )
                      }
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() =>
                        setCurrentMediaIndex((prev) =>
                          prev === listing.images.length - 1 ? 0 : prev + 1
                        )
                      }
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-[400px] bg-gray-800 rounded-md flex items-center justify-center text-muted-foreground">
                No media available
              </div>
            )}

            {/* Thumbnails */}
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
                        onError={(e) =>
                          console.error(
                            "Thumbnail video error:",
                            e.currentTarget.error
                          )
                        }
                      />
                    ) : (
                      <Image
                        src={mediaUrl || "/placeholder-image.jpg"} // Fallback for Image src
                        alt={`Thumbnail ${index + 1}`}
                        width={96}
                        height={96}
                        objectFit="cover"
                        onError={(e) =>
                          console.error(
                            "Thumbnail image error:",
                            e.currentTarget.src
                          )
                        }
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

        {/* Right Column: Product Info and Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Listing Summary */}
          <Card className="p-6 bg-card rounded-lg shadow-sm">
            <CardTitle className="text-2xl font-bold mb-2">
              {listing.title}
            </CardTitle>
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

            {/* Price and Discount Section */}
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              <p className="text-sm font-semibold">Welcome deal • SuperDeals</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-primary">
                  {listing.currency} {listing.price.toFixed(2)}
                </p>
                {/* Assuming a discount for demonstration */}
                <p className="text-sm text-muted-foreground line-through">
                  {listing.currency} {(listing.price * 1.5).toFixed(2)}
                </p>
                <p className="text-xs text-red-500">Only 64 left</p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mb-4 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Ship to:</span>{" "}
                Ethiopia
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Free shipping over
                </span>{" "}
                {listing.currency} 1,675.25
              </p>
              <p>
                <span className="font-semibold text-foreground">Delivery:</span>{" "}
                Nov 03 - 16
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold text-foreground">Quantity:</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="px-3">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-6 py-2 flex items-center mb-2">
              Buy Now
            </Button>
            <Button variant="outline" className="w-full flex items-center">
              <Plus className="mr-2" size={16} /> Add to Cart
            </Button>
          </Card>

          {/* Customer Reviews Summary */}
          {listing.reviewCount !== undefined && listing.reviewCount > 0 && (
            <Card className="p-6 bg-card rounded-lg shadow-sm">
              <CardTitle className="text-xl font-semibold mb-4">
                Customer Reviews
              </CardTitle>
              <div className="flex items-center mb-2">
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
                <span className="text-lg font-bold ml-2">
                  {listing.rating?.toFixed(1) || "N/A"}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({listing.reviewCount} reviews)
                </span>
              </div>
              <Button variant="link" className="p-0 h-auto text-sm">
                View All Reviews
              </Button>
            </Card>
          )}

          {/* Seller Information */}
          <Card className="p-6 bg-card rounded-lg shadow-sm">
            <CardTitle className="text-xl font-semibold mb-4">
              Sold by
            </CardTitle>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12">
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
                <Button variant="link" className="p-0 h-auto text-sm">
                  View Store
                </Button>
              </div>
            </div>
          </Card>

          {/* Additional Details (simplified) */}
          <Card className="p-6 bg-card rounded-lg shadow-sm">
            <CardTitle className="text-xl font-semibold mb-4">
              Service Guarantees
            </CardTitle>
            <CardContent className="p-0 space-y-2 text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Return & Refund Policy
                </span>
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Security & Privacy
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Message Seller Button */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} /> Message Seller
          </Button>
        </div>
      </div>

      {/* Related Items Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related items</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Placeholder for related items - using dummy data for demonstration */}
          {[1, 2, 3, 4, 5].map((item) => (
            <Card
              key={item}
              className="p-4 flex flex-col items-center text-center"
            >
              <div className="relative w-full h-32 bg-muted rounded-md mb-2 overflow-hidden">
                <Image
                  src={`/placeholder-avatar.jpg`} // Using a generic placeholder image
                  alt={`Related Item ${item}`}
                  layout="fill"
                  objectFit="cover"
                  onError={(e) =>
                    console.error(
                      "Related item image error:",
                      e.currentTarget.src
                    )
                  }
                />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Related Item {item}
              </p>
              <p className="text-xs text-muted-foreground">
                ETB {item * 100}.00
              </p>
              <Button variant="ghost" size="sm" className="mt-2">
                View
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
