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
          skills: true,
          createdAt: true,
          updatedAt: true,
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

        // 1️⃣ Update the user's image in the database
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
          req, // Pass req and res to ensure cookie is re-issued
          res,
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
        displayName: z.string().min(1),
        bio: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx: { session, prisma, req, res }, input }) => {
      try {
        const updatedUser = await prisma.user.update({
          where: { id: session!.user.id },
          data: {
            name: input.displayName,
            bio: input.bio,
            location: input.location,
          },
        });

        // Re-fetch the session to ensure the cookie is updated with the latest user data
        await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
          req, // Pass req and res to ensure cookie is re-issued
          res,
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
        const updatedUser = await prisma.user.update({
          where: { id: session!.user.id },
          data: {
            skills: input.skills,
          },
        });

        // Re-fetch the session to ensure the cookie is updated with the latest user data
        await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
          req, // Pass req and res to ensure cookie is re-issued
          res,
        });

        return {
          message: "Skills updated successfully",
          user: updatedUser,
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
