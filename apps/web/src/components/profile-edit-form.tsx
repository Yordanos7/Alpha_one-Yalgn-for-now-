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

const profileFormSchema = z.object({
  bio: z.string().optional(),
  location: z.string().optional(),
  languages: z.string().optional(), // Simplified for now, could be string[]
  mainCategory: z.nativeEnum(CategoryEnum).optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
  userId: string;
  initialData: ProfileFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProfileEditForm({
  userId,
  initialData,
  onSuccess,
  onCancel,
}: ProfileEditFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: initialData.bio || "",
      location: initialData.location || "",
      languages: initialData.languages || "",
      mainCategory: initialData.mainCategory || null,
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

  async function onSubmit(values: ProfileFormValues) {
    updateProfileMutation.mutate({
      id: userId, // Assuming the backend mutation expects 'id' for the user to update
      bio: values.bio,
      location: values.location,
      languages: values.languages ? [values.languages] : [], // Convert string to array
      mainCategory: values.mainCategory,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            disabled={updateProfileMutation.status === "pending"}
          >
            {updateProfileMutation.status === "pending" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
