"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"; // Import Label
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

interface ReviewListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    tags: string[];
    isPublished: boolean;
  };
  onListingUpdated: () => void;
}

export function ReviewListingDialog({
  isOpen,
  onClose,
  listing,
  onListingUpdated,
}: ReviewListingDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const updateListingMutation = trpc.listing.update.useMutation();

  const handlePublishToMarketplace = async () => {
    if (listing.isPublished) {
      onClose(); // Already published, just close
      return;
    }

    setIsPublishing(true);
    try {
      await updateListingMutation.mutateAsync({
        id: listing.id,
        isPublished: true,
      });
      toast.success("Listing published to marketplace!");
      onListingUpdated();
      onClose();
    } catch (error) {
      console.error("Error publishing listing:", error);
      toast.error("Error publishing listing. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleKeepAsDraft = () => {
    toast("Listing saved as draft on your profile.");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2C2C2C] text-white p-6 rounded-lg max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Review Your Listing
          </DialogTitle>
          <DialogDescription>
            Your product/service has been created. Review the details below and
            decide whether to publish it to the marketplace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Listing Details */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
            <p className="text-gray-300 mb-4">{listing.description}</p>
            <p className="text-green-500 font-bold text-lg mb-2">
              {listing.price} {listing.currency}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {listing.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              Status:{" "}
              <span className="font-semibold">
                {listing.isPublished ? "Published" : "Draft"}
              </span>
            </p>
          </div>

          {/* Image/Video Preview */}
          <div>
            <Label className="text-gray-300 mb-2 block">Media Preview</Label>
            {listing.images && listing.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {listing.images.map((imgSrc, index) => (
                  <div
                    key={index}
                    className="relative w-full h-32 rounded-md overflow-hidden"
                  >
                    <Image
                      src={imgSrc}
                      alt={`Listing media ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-32 bg-[#3A3A3A] rounded-md flex items-center justify-center text-gray-400">
                No media uploaded
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleKeepAsDraft}
            className="border-gray-600 text-gray-300 hover:bg-[#3A3A3A]"
          >
            Keep as Draft
          </Button>
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
            onClick={handlePublishToMarketplace}
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing..." : "Publish to Marketplace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
