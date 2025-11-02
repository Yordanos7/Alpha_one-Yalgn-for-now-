"use client";

import { useSession } from "@/hooks/use-session";
import { trpc } from "@/utils/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ListingForm } from "@/components/listing-form";
import { useState } from "react";
import { toast } from "sonner";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@Alpha/api/routers";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Listing = RouterOutput["listing"]["getByUserId"][number]; // Get the type of a single listing from the array

export default function MyListingsPage() {
  const { session, isLoading: isSessionLoading } = useSession();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    data: listings,
    isLoading: areListingsLoading,
    error: listingsError,
    refetch: refetchListings,
  } = trpc.listing.getByUserId.useQuery(
    { userId: session?.user?.id! },
    {
      enabled: !!session?.user?.id,
    }
  );

  const createListingMutation = trpc.listing.create.useMutation({
    onSuccess: () => {
      toast.success("Listing created successfully!");
      setIsFormOpen(false);
      refetchListings();
    },
    onError: (error: any) => {
      // Explicitly type error
      toast.error("Failed to create listing: " + error.message);
    },
  });

  const handleCreateListing = (data: any) => {
    createListingMutation.mutate(data);
  };

  if (isSessionLoading || areListingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader className="animate-spin" size={48} />
        <p className="text-gray-400 mt-4">Loading your listings...</p>
      </div>
    );
  }

  if (listingsError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        Error loading your listings: {listingsError.message}
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        You must be logged in to view your listings.
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#202020] text-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Products & Services</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-4 py-2 flex items-center">
              <Plus className="mr-2" size={16} /> Post New Product/Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#2C2C2C] text-white p-6 rounded-lg max-w-3xl">
            <ListingForm
              onSubmit={handleCreateListing}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing: Listing) => (
            <Card
              key={listing.id}
              className="bg-[#2C2C2C] rounded-lg shadow-md overflow-hidden"
            >
              <Link href={`/profile/${listing.id}` as string}>
                <div className="relative w-full h-48 bg-muted">
                  {listing.images && listing.images.length > 0 && (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                </div>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-1">
                    {listing.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {listing.description}
                  </p>
                  <p className="text-xl font-bold text-yellow-500">
                    {listing.currency} {listing.price.toFixed(2)}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 p-8">
          <p>You haven't posted any products or services yet.</p>
          <p className="mt-2">
            Click "Post New Product/Service" to get started!
          </p>
        </div>
      )}
    </div>
  );
}
