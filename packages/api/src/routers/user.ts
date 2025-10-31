import { protectedProcedure, router } from "../index"; /// thisb is import for trpc router
import { TRPCError } from "@trpc/server";
import { z } from "zod"; // zod for input validation of the data from the client
import { auth } from "@Alpha/auth"; // Better-Auth instance
import { fromNodeHeaders } from "better-auth/node";
import { AccountType } from "@Alpha/db"; // Import AccountType enum from @Alpha/db
import { PrismaClient } from "@Alpha/db/prisma/generated/client"; // Explicitly import PrismaClient

export const userRouter = router({
  getUserProfile: protectedProcedure.query(
    async ({ ctx: { user, prisma } }) => {
      if (!user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      const userData = await prisma.user.findUnique({
        // Use db.user
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          location: true,
          accountType: true, // Add accountType here
          isOpenToWork: true,
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
    }
  ),

  uploadProfileImage: protectedProcedure
    .input(z.object({ filePath: z.string() }))
    .mutation(async ({ ctx: { user, prisma, req, res }, input }) => {
      try {
        console.log(
          "tRPC uploadProfileImage mutation received filePath:",
          input.filePath
        );

        // 1️⃣ Update the user's avatarUrl in the database
        const updatedUser = await prisma.user.update({
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
    .mutation(async ({ ctx: { user, prisma, req, res }, input }) => {
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

        await prisma.profile.upsert({
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
    .mutation(async ({ ctx: { user, prisma, req, res }, input }) => {
      try {
        // Find or create skills and connect them to the user's profile
        const skillConnects = await Promise.all(
          input.skills.map(async (skillName) => {
            const skill = await prisma.skill.upsert({
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
        await prisma.profile.update({
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

  getSession: protectedProcedure.query(
    async ({ ctx: { user, prisma, session } }) => {
      if (!user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          location: true,
          accountType: true, // Ensure accountType is selected
        },
      });

      if (!fullUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        session: session,
        user: {
          ...user, // Keep existing user data from context
          ...fullUser, // Overlay with data from DB, including accountType
        },
      };
    }
  ),

  getPublicUserProfile: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx: { prisma }, input }) => {
      const { userId } = input;
      const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          location: true,
          accountType: true,
          profile: {
            select: {
              headline: true,
              hourlyRate: true,
              currency: true,
              availability: true,
              completedJobs: true,
              successRate: true,
              experience: true,
              education: true,
              portfolio: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  media: true,
                  link: true,
                },
              },
              skills: {
                select: {
                  skill: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              isPublicFreelancer: true, // Include the new field
            },
          },
        },
      });

      if (!userProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User profile not found.",
        });
      }

      return userProfile;
    }),

  list: protectedProcedure.query(async ({ ctx: { user, prisma } }) => {
    const userId = user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    return prisma.user.findMany({
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
    .mutation(async ({ ctx: { user, prisma, req, res }, input }) => {
      if (!user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      try {
        // Update User model
        await prisma.user.update({
          where: { id: user.id },
          data: {
            accountType: input.step1.userType.toUpperCase() as AccountType, // Convert to uppercase for Prisma enum
            onboarded: true, // Mark onboarding as complete
          },
        });

        // Update Profile model (create if not exists)
        await prisma.profile.upsert({
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

        await prisma.profile.update({
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

  toggleFreelancerPublicStatus: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        isPublic: z.boolean(),
      })
    )
    .mutation(async ({ ctx: { user, prisma, req, res }, input }) => {
      if (!user?.id || user.id !== input.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to update this profile.",
        });
      }

      // Ensure the user is an individual
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { accountType: true },
      });

      if (currentUser?.accountType !== AccountType.INDIVIDUAL) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Only individual accounts can be listed as public freelancers.",
        });
      }

      try {
        await prisma.profile.update({
          where: { userId: input.userId },
          data: {
            isPublicFreelancer: input.isPublic,
          },
        });

        // Re-fetch the session to ensure the cookie is updated with the latest user data
        await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });

        return {
          message: `Freelancer public status updated to ${input.isPublic}`,
          isPublicFreelancer: input.isPublic,
        };
      } catch (error) {
        console.error("Error toggling freelancer public status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update freelancer public status",
        });
      }
    }),

  updateIsOpenToWork: protectedProcedure
    .input(z.object({ isOpenToWork: z.boolean() }))
    .mutation(async ({ ctx: { user, prisma, req, res }, input }) => {
      if (!user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      try {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            isOpenToWork: input.isOpenToWork,
          },
        });
        // this is for refetch the session for update the cookie
        await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });
        return {
          message:
            "the user is open to work the status is updated successfully",
          isOpenToWork: updatedUser.isOpenToWork,
        };
      } catch (error) {
        console.error("Error Update isOpenToWork status got error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update isOpenToWork status",
        });
      }
    }),
});
