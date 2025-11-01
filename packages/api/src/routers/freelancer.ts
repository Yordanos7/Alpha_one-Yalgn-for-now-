import { publicProcedure, router } from "../index";
import { z } from "zod";
import { prisma } from "../prisma";
import {
  CategoryEnum,
  ExperienceLevel,
  FreelancerLevel,
  DeliveryTime,
  JobType,
  Role,
} from "@Alpha/db/prisma/generated/client"; // Corrected import path using alias

// Zod schema for validating incoming filter parameters
const freelancerFilterSchema = z.object({
  search: z.string().optional(),
  category: z.nativeEnum(CategoryEnum).optional(),
  rateType: z.nativeEnum(JobType).optional(),
  experiences: z.nativeEnum(ExperienceLevel).optional(),
  language: z.string().optional(),
  rating: z
    .preprocess((val) => parseInt(String(val), 10), z.number().min(1).max(5))
    .optional(),
  level: z.nativeEnum(FreelancerLevel).optional(),
  estimatedDelivery: z.nativeEnum(DeliveryTime).optional(),
  location: z.string().optional(),
  isVerified: z.boolean().optional(),
  isOpenToWork: z.boolean().optional(),
});

export const freelancerRouter = router({
  getFilteredFreelancers: publicProcedure
    .input(freelancerFilterSchema)
    .query(
      async ({ input }: { input: z.infer<typeof freelancerFilterSchema> }) => {
        // Explicitly typed input
        const {
          search,
          category,
          rateType,
          experiences,
          language,
          rating,
          level,
          estimatedDelivery,
          location,
          isVerified,
          isOpenToWork,
        } = input;

        const whereClause: any = {
          role: Role.PROVIDER, // Only fetch users with the PROVIDER role
          // Ensure they are public freelancers or open to work if those fields are relevant
          profile: {
            isPublicFreelancer: true, // Assuming only public profiles are listed
          },
        };

        // Apply search filter
        if (search) {
          whereClause.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { bio: { contains: search, mode: "insensitive" } },
            {
              profile: { headline: { contains: search, mode: "insensitive" } },
            },
            // Add other searchable fields like skills if needed
          ];
        }

        // Apply other filters to the User and Profile models
        if (location) {
          whereClause.location = { contains: location, mode: "insensitive" };
        }
        if (isVerified !== undefined) {
          whereClause.isVerified = isVerified;
        }
        if (isOpenToWork !== undefined) {
          whereClause.isOpenToWork = isOpenToWork;
        }

        // Profile-specific filters
        whereClause.profile = {
          ...whereClause.profile, // Keep existing profile conditions
        };

        if (category) {
          whereClause.profile.mainCategory = category;
        }
        if (rateType) {
          whereClause.profile.rateTypePreference = rateType;
        }
        if (experiences) {
          whereClause.profile.experienceLevel = experiences;
        }
        if (rating) {
          whereClause.profile.averageRating = { gte: rating }; // Greater than or equal to the selected rating
        }
        if (level) {
          whereClause.profile.freelancerLevel = level;
        }
        if (estimatedDelivery) {
          whereClause.profile.deliveryTime = estimatedDelivery;
        }
        if (language) {
          whereClause.languages = {
            has: language, // Assuming languages array stores just the language name, e.g., ["English", "Amharic"]
            // If it's "English:Fluent", you might need a more complex query or a separate Language model
          };
        }

        const freelancers = await prisma.user.findMany({
          where: whereClause,
          include: {
            profile: {
              include: {
                skills: {
                  include: {
                    skill: true,
                  },
                },
              },
            },
            // Include other relations if needed for display, e.g., listings
          },
        });

        return freelancers;
      }
    ),
});
