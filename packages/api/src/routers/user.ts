import { protectedProcedure, router } from "../index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@Alpha/auth"; // Better-Auth instance
import { fromNodeHeaders } from "better-auth/node";

export const userRouter = router({
  getUserProfile: protectedProcedure.query(async ({ ctx: { user, db } }) => {
    // Use ctx.db instead of ctx.prisma
    if (!user?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    const userData = await db.user.findUnique({
      // Use db.user
      where: { id: user.id },
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

    if (!userData) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return userData;
  }),

  uploadProfileImage: protectedProcedure
    .input(z.object({ filePath: z.string() }))
    .mutation(async ({ ctx: { user, db, req, res }, input }) => {
      // Use ctx.db, req, res
      try {
        console.log(
          "tRPC uploadProfileImage mutation received filePath:",
          input.filePath
        );

        // 1️⃣ Update the user's avatarUrl in the database
        const updatedUser = await db.user.update({
          // Use db.user
          where: { id: user!.id },
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
    .mutation(async ({ ctx: { user, db, req, res }, input }) => {
      // Use ctx.db, req, res
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

        const updatedUser = await db.user.update({
          // Use db.user
          where: { id: user!.id },
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

        await db.profile.upsert({
          // Use db.profile
          where: { userId: user!.id },
          update: profileUpdateData,
          create: {
            userId: user!.id,
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
    .mutation(async ({ ctx: { user, db, req, res }, input }) => {
      // Use ctx.db, req, res
      try {
        // Find or create skills and connect them to the user's profile
        const skillConnects = await Promise.all(
          input.skills.map(async (skillName) => {
            const skill = await db.skill.upsert({
              // Use db.skill
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
        await db.profile.update({
          // Use db.profile
          where: { userId: user!.id },
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

  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  list: protectedProcedure.query(async ({ ctx: { user, db } }) => {
    const userId = user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    return db.user.findMany({
      where: {
        id: {
          not: userId, // Exclude the current user
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
  }),

  completeOnboarding: protectedProcedure
    .input(
      z.object({
        step1: z.object({
          userType: z.enum(["individual", "organization"]),
          individualFocus: z
            .enum(["freelancer", "student", "mentor", "job_seeker", "other"])
            .optional(),
          organizationPurpose: z.string().optional(),
        }),
        step2: z.object({
          howHear: z.enum([
            "social_media",
            "friend",
            "organization",
            "search_engine",
            "other",
          ]),
          otherText: z.string().optional(),
        }),
        step3: z.object({
          goals: z.array(
            z.enum([
              "find_freelance_work",
              "hire_professionals",
              "apply_scholarships",
              "offer_scholarships_mentorship",
              "network_collaborate",
            ])
          ),
        }),
        step4: z.object({
          skills: z.array(z.string()),
        }),
      })
    )
    .mutation(async ({ ctx: { user, db, req, res }, input }) => {
      if (!user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      try {
        // Update User model
        await db.user.update({
          where: { id: user.id },
          data: {
            accountType: input.step1.userType,
            onboarded: true, // Mark onboarding as complete
          },
        });

        // Update Profile model (create if not exists)
        await db.profile.upsert({
          where: { userId: user.id },
          update: {
            howHear: input.step2.howHear,
            howHearOther: input.step2.otherText,
            goals: input.step3.goals,
            individualFocus: input.step1.individualFocus,
            organizationPurpose: input.step1.organizationPurpose,
          },
          create: {
            userId: user.id,
            howHear: input.step2.howHear,
            howHearOther: input.step2.otherText,
            goals: input.step3.goals,
            individualFocus: input.step1.individualFocus,
            organizationPurpose: input.step1.organizationPurpose,
          },
        });

        // Handle skills (similar to updateSkills)
        const skillConnects = await Promise.all(
          input.step4.skills.map(async (skillName) => {
            const skill = await db.skill.upsert({
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

        await db.profile.update({
          where: { userId: user.id },
          data: {
            skills: {
              deleteMany: {},
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

        return { message: "Onboarding completed successfully!" };
      } catch (error) {
        console.error("Error completing onboarding:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to complete onboarding",
        });
      }
    }),
});
