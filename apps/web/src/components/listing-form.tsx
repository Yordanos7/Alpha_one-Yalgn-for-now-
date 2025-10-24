"use client";

import { useState } from "react";
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
  const [newImageUrl, setNewImageUrl] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished || false
  );

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() !== "" && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setImages(images.filter((image) => image !== imageToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      price: parseFloat(price),
      currency,
      deliveryDays: deliveryDays ? parseInt(deliveryDays) : undefined,
      categoryId,
      images,
      tags,
      isPublished,
    });
  };

  // Mock categories for now
  const mockCategories = [
    { id: "cat1", name: "Web Development" },
    { id: "cat2", name: "Graphic Design" },
    { id: "cat3", name: "Digital Marketing" },
    { id: "cat4", name: "Writing & Translation" },
    { id: "cat5", name: "Video & Animation" },
  ];

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
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-[#3A3A3A] border-none text-white mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-[#3A3A3A] text-white">
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="images" className="text-gray-300">
              Images/Videos (URLs for now)
            </Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="newImageUrl"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Add image/video URL"
                className="flex-1 bg-[#3A3A3A] border-none text-white placeholder-gray-400"
              />
              <Button
                type="button"
                onClick={handleAddImage}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus size={20} />
              </Button>
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
            </div>
            <p className="text-sm text-gray-500 mt-2">
              (In a real implementation, this would be a file upload component.)
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Listing"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
