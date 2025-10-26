"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/utils/trpc";

interface ListingFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    price: number;
    currency: "ETB" | "USD";
    deliveryDays?: number;
    categoryId?: string;
    images: string[];
    videos: string[];
    tags: string[];
    isPublished: boolean;
  };
  onSubmit: (data: any) => void; // Will be replaced with actual tRPC mutation later
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ListingForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ListingFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [currency, setCurrency] = useState<"ETB" | "USD">(
    initialData?.currency || "ETB"
  );
  const [deliveryDays, setDeliveryDays] = useState(
    initialData?.deliveryDays?.toString() || ""
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [videos, setVideos] = useState<string[]>(initialData?.videos || []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished || false
  );

  const { data: categories, isPending: isCategoriesPending } =
    trpc.category.getAll.useQuery();

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setImages(images.filter((image) => image !== imageToRemove));
  };

  const handleRemoveVideo = (videoToRemove: string) => {
    setVideos(videos.filter((video) => video !== videoToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingImage(true);

    const uploadedImagePaths: string[] = [];
    const uploadedVideoPaths: string[] = [];

    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (result.success) {
            if (file.type.startsWith("image/")) {
              uploadedImagePaths.push(result.path);
            } else if (file.type.startsWith("video/")) {
              uploadedVideoPaths.push(result.path);
            }
          } else {
            console.error("Error uploading file:", result);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }

    const finalImages = [...images, ...uploadedImagePaths];
    const finalVideos = [...videos, ...uploadedVideoPaths];

    onSubmit({
      title,
      description,
      price: parseFloat(price),
      currency,
      deliveryDays: deliveryDays ? parseInt(deliveryDays) : undefined,
      categoryId,
      images: finalImages,
      videos: finalVideos,
      tags,
      isPublished,
    });

    setIsUploadingImage(false);
  };

  return (
    <Card className="bg-[#2C2C2C] p-6 rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {initialData ? "Edit Listing" : "Create New Listing"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-gray-300">
              Listing Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Custom Website Design Service"
              className="bg-[#3A3A3A] border-none text-white placeholder-gray-400 mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of your product or service."
              className="bg-[#3A3A3A] border-none text-white placeholder-gray-400 mt-1 min-h-[150px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-gray-300">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 150.00"
                className="bg-[#3A3A3A] border-none text-white placeholder-gray-400 mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency" className="text-gray-300">
                Currency
              </Label>
              <Select
                value={currency}
                onValueChange={(value: "ETB" | "USD") => setCurrency(value)}
              >
                <SelectTrigger className="bg-[#3A3A3A] border-none text-white mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-[#3A3A3A] text-white">
                  <SelectItem value="ETB">ETB</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="deliveryDays" className="text-gray-300">
              Estimated Delivery Days (for services, optional)
            </Label>
            <Input
              id="deliveryDays"
              type="number"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              placeholder="e.g., 7"
              className="bg-[#3A3A3A] border-none text-white placeholder-gray-400 mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-gray-300">
              Category
            </Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={isCategoriesPending}
            >
              <SelectTrigger className="bg-[#3A3A3A] border-none text-white mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-[#3A3A3A] text-white">
                {isCategoriesPending ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  categories?.map((cat: { id: string; name: string }) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="images" className="text-gray-300">
              Images/Videos
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleFileChange}
                className="flex-1 bg-[#3A3A3A] border-none text-white placeholder-gray-400"
                ref={fileInputRef}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {images.map((image) => (
                <Badge
                  key={image}
                  variant="secondary"
                  className="bg-[#3A3A3A] text-white px-3 py-1 rounded-full flex items-center"
                >
                  {image.length > 30 ? image.substring(0, 27) + "..." : image}
                  <X
                    className="ml-2 cursor-pointer"
                    size={14}
                    onClick={() => handleRemoveImage(image)}
                  />
                </Badge>
              ))}
              {videos.map((video) => (
                <Badge
                  key={video}
                  variant="secondary"
                  className="bg-[#3A3A3A] text-white px-3 py-1 rounded-full flex items-center"
                >
                  {video.length > 30 ? video.substring(0, 27) + "..." : video}
                  <X
                    className="ml-2 cursor-pointer"
                    size={14}
                    onClick={() => handleRemoveVideo(video)}
                  />
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              (Upload multiple images/videos for your listing.)
            </p>
          </div>

          <div>
            <Label htmlFor="tags" className="text-gray-300">
              Tags (e.g., keywords, skills)
            </Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="newTag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag (e.g., React, UI/UX)"
                className="flex-1 bg-[#3A3A3A] border-none text-white placeholder-gray-400"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus size={20} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-[#3A3A3A] text-white px-3 py-1 rounded-full flex items-center"
                >
                  {tag}
                  <X
                    className="ml-2 cursor-pointer"
                    size={14}
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isPublished" className="text-gray-300">
              Publish Listing
            </Label>
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-600 text-gray-300 hover:bg-[#3A3A3A]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold"
              disabled={isSubmitting || isUploadingImage}
            >
              {isSubmitting || isUploadingImage ? "Saving..." : "Save Listing"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
