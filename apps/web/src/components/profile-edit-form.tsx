"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CategoryEnum } from "@Alpha/db/prisma/generated/client";
import { useState } from "react"; // Import useState

const profileFormSchema = z.object({
  bio: z.string().optional(),
  location: z.string().optional(),
  languages: z.string().optional(), // Simplified for now, could be string[]
  mainCategory: z.nativeEnum(CategoryEnum).optional().nullable(),
  image: z.any().optional(), // Added for image upload
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
  userId: string;
  initialData: ProfileFormValues & { imageUrl?: string | null }; // Add imageUrl to initialData
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProfileEditForm({
  userId,
  initialData,
  onSuccess,
  onCancel,
}: ProfileEditFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData.imageUrl || null
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: initialData.bio || "",
      location: initialData.location || "",
      languages: initialData.languages || "",
      mainCategory: initialData.mainCategory || null,
      image: undefined, // Initialize image field
    },
  });

  const { data: categoryData, isLoading: isLoadingCategories } =
    trpc.category.getAll.useQuery();

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + error.message);
    },
  });

  const uploadImageMutation = trpc.upload.uploadImage.useMutation({
    onSuccess: (data) => {
      // After image upload, update the user's profile with the new image URL
      updateProfileMutation.mutate({
        id: userId,
        image: data.url, // Assuming the backend expects 'image' for the user's profile image URL
      });
    },
    onError: (error) => {
      toast.error("Failed to upload image: " + error.message);
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    if (values.image && values.image instanceof FileList) {
      const file = values.image[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        uploadImageMutation.mutate(formData); // Use the uploadImageMutation
      }
    } else {
      updateProfileMutation.mutate({
        id: userId,
        bio: values.bio,
        location: values.location,
        languages: values.languages ? [values.languages] : [], // Convert string to array
        mainCategory: values.mainCategory,
      });
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", event.target.files); // Set the FileList object to the form field
    } else {
      setImagePreview(initialData.imageUrl || null);
      form.setValue("image", undefined);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="bg-[#3A3A3A] border-none text-white"
                  onChange={handleImageChange}
                />
              </FormControl>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="mt-2 h-24 w-24 rounded-full object-cover"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about yourself"
                  className="resize-y bg-[#3A3A3A] border-none text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Addis Ababa, Ethiopia"
                  className="bg-[#3A3A3A] border-none text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., English, Amharic"
                  className="bg-[#3A3A3A] border-none text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mainCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Category</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "" ? null : value)
                }
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger className="bg-[#3A3A3A] border-none text-gray-400 hover:text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#3A3A3A] text-white">
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    <>
                      <SelectItem value="">None</SelectItem>{" "}
                      {/* Option to clear category */}
                      {categoryData?.categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              updateProfileMutation.status === "pending" ||
              uploadImageMutation.status === "pending"
            }
          >
            {(updateProfileMutation.status === "pending" ||
              uploadImageMutation.status === "pending") && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
