import { protectedProcedure, router } from "../index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@Alpha/auth"; // Better-Auth instance
import { fromNodeHeaders } from "better-auth/node";

export const userRouter = router({
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
});
