import { protectedProcedure, router } from "../index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@Alpha/auth"; // Better-Auth instance
import { fromNodeHeaders } from "better-auth/node";

export const userRouter = router({
  getUserProfile: protectedProcedure.query(
    async ({ ctx: { session, prisma } }) => {
      if (!session?.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          location: true,
          profile: {
            select: {
              skills: {
                select: {
                  skill: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              headline: true,
              hourlyRate: true,
              currency: true,
              availability: true,
              completedJobs: true,
              successRate: true,
              portfolio: true,
              education: true,
              experience: true,
            },
          },
          verification: {
            select: {
              status: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          languages: true,
          coins: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }
  ),

  uploadProfileImage: protectedProcedure
    .input(z.object({ filePath: z.string() }))
    .mutation(async ({ ctx: { session, prisma, req, res }, input }) => {
      try {
        console.log(
          "tRPC uploadProfileImage mutation received filePath:",
          input.filePath
        );

        // 1️⃣ Update the user's avatarUrl in the database
        const updatedUser = await prisma.user.update({
          where: { id: session!.user.id },
          data: { image: input.filePath },
        });

        console.log(
          "Profile image successfully saved to DB:",
          updatedUser.image
        );

        // Re-fetch the session to ensure the cookie is updated with the latest user data
        await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });

        return {
          message: "Profile image uploaded successfully",
          profileImage: updatedUser.image,
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
        name: z.string().min(1).optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        headline: z.string().optional(),
        hourlyRate: z.number().optional(),
        currency: z.enum(["ETB", "USD"]).optional(),
        availability: z.string().optional(),
        education: z.any().optional(), // Using z.any() for Json type
        experience: z.any().optional(), // Using z.any() for Json type
      })
    )
    .mutation(async ({ ctx: { session, prisma, req, res }, input }) => {
      try {
        // Update User model fields
        const userUpdateData: {
          name?: string;
          bio?: string;
          location?: string;
        } = {};
        if (input.name !== undefined) userUpdateData.name = input.name;
        if (input.bio !== undefined) userUpdateData.bio = input.bio;
        if (input.location !== undefined)
          userUpdateData.location = input.location;

        const updatedUser = await prisma.user.update({
          where: { id: session!.user.id },
          data: userUpdateData,
        });

        // Update Profile model fields (create if not exists)
        const profileUpdateData: {
          headline?: string;
          hourlyRate?: number;
          currency?: "ETB" | "USD";
          availability?: string;
          education?: any;
          experience?: any;
        } = {};
        if (input.headline !== undefined)
          profileUpdateData.headline = input.headline;
        if (input.hourlyRate !== undefined)
          profileUpdateData.hourlyRate = input.hourlyRate;
        if (input.currency !== undefined)
          profileUpdateData.currency = input.currency;
        if (input.availability !== undefined)
          profileUpdateData.availability = input.availability;
        if (input.education !== undefined)
          profileUpdateData.education = input.education;
        if (input.experience !== undefined)
          profileUpdateData.experience = input.experience;

        await prisma.profile.upsert({
          where: { userId: session!.user.id },
          update: profileUpdateData,
          create: {
            userId: session!.user.id,
            ...profileUpdateData,
          },
        });

        // Re-fetch the session to ensure the cookie is updated with the latest user data
        await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
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

  updateSkills: protectedProcedure
    .input(z.object({ skills: z.array(z.string()) }))
    .mutation(async ({ ctx: { session, prisma, req, res }, input }) => {
      try {
        // Find or create skills and connect them to the user's profile
        const skillConnects = await Promise.all(
          input.skills.map(async (skillName) => {
            const skill = await prisma.skill.upsert({
              where: { name: skillName },
              update: {},
              create: {
                name: skillName,
                slug: skillName.toLowerCase().replace(/\s/g, "-"),
              },
            });
            return { skillId: skill.id };
          })
        );

        // Update the user's profile to connect the skills
        await prisma.profile.update({
          where: { userId: session!.user.id },
          data: {
            skills: {
              deleteMany: {}, // Delete all existing ProfileSkill records for this profile
              create: skillConnects.map((s) => ({
                skill: { connect: { id: s.skillId } },
              })),
            },
          },
        });

        // Re-fetch the session to ensure the cookie is updated with the latest user data
        await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });

        return {
          message: "Skills updated successfully",
        };
      } catch (error) {
        console.error("Database update error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user skills",
        });
      }
    }),
});
