import { protectedProcedure, router } from "../index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = router({
  uploadProfileImage: protectedProcedure
    .input(z.object({ filePath: z.string() }))
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      // Destructure ctx to assert session is not null
      try {
        console.log(
          "tRPC uploadProfileImage mutation received filePath:",
          input.filePath
        );
        const updatedUser = await prisma.user.update({
          where: { id: session!.user.id }, // Add non-null assertion
          data: { profileImage: input.filePath },
        });
        console.log(
          "Profile image path successfully saved to DB:",
          updatedUser.profileImage
        );
        return {
          message: "Profile image uploaded successfully",
          profileImage: updatedUser.profileImage,
        };
      } catch (dbError) {
        console.error("Database update error in uploadProfileImage:", dbError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile image in database",
        });
      }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1),
        bio: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      // Destructure ctx to assert session is not null
      try {
        const updatedUser = await prisma.user.update({
          where: { id: session!.user.id }, // Add non-null assertion
          data: {
            name: input.displayName,
            bio: input.bio,
            location: input.location,
          },
        });
        return {
          message: "Profile updated successfully",
          user: updatedUser,
        };
      } catch (error) {
        console.error("Database update error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user profile",
        });
      }
    }),

  completeOnboarding: protectedProcedure
    .input(
      z.object({
        step1: z
          .object({
            userType: z.enum(["individual", "organization"]),
            individualFocus: z
              .enum(["freelancer", "student", "mentor", "job_seeker", "other"])
              .optional(),
            organizationPurpose: z.string().optional(),
          })
          .optional(),
        step2: z
          .object({
            howHear: z.enum([
              "social_media",
              "friend",
              "organization",
              "search_engine",
              "other",
            ]),
            otherText: z.string().optional(),
          })
          .optional(),
        step3: z
          .object({
            goals: z.array(
              z.enum([
                "find_freelance_work",
                "hire_professionals",
                "apply_scholarships",
                "offer_scholarships_mentorship",
                "network_collaborate",
              ])
            ),
          })
          .optional(),
        step4: z
          .object({
            skills: z.array(z.string()),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      try {
        const updateData: any = {};

        if (input.step1) {
          updateData.userType = input.step1.userType;
          if (input.step1.individualFocus) {
            updateData.individualFocus = input.step1.individualFocus;
          }
          if (input.step1.organizationPurpose) {
            updateData.organizationPurpose = input.step1.organizationPurpose;
          }
        }

        if (input.step2) {
          updateData.howHear = input.step2.howHear;
          if (input.step2.otherText) {
            updateData.howHearOther = input.step2.otherText; // Assuming a new field for other text
          }
        }

        if (input.step3) {
          updateData.goals = input.step3.goals; // Assuming goals can be stored as an array of strings
        }

        if (input.step4) {
          updateData.skills = input.step4.skills; // Assuming skills can be stored as an array of strings
        }

        const updatedUser = await prisma.user.update({
          where: { id: session!.user.id },
          data: updateData,
        });

        return {
          message: "Onboarding data saved successfully",
          user: updatedUser,
        };
      } catch (error) {
        console.error("Error saving onboarding data:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save onboarding data",
        });
      }
    }),
});
