import { z } from "zod";
import { protectedProcedure, router } from "../index";
import { TRPCError } from "@trpc/server";
import { type User } from "@Alpha/db/prisma/generated/client"; // Import User type

export const jobRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.job.findMany({
      include: {
        seeker: {
          select: {
            name: true,
          },
        },
        proposals: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        location: z.string().min(1),
        budget: z.string().min(1), // Will be parsed to float range
        deadline: z.string().min(1), // Will be parsed to Date
        description: z.string().min(1),
        skills: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, location, budget, deadline, description, skills } = input;
      const seekerId = ctx.user!.id; // Get seekerId from ctx.user

      // Parse budget range (assuming "min - max" format or single number)
      let budgetMin: number | null = null;
      let budgetMax: number | null = null;
      const budgetParts = budget.split("-").map((s) => parseFloat(s.trim()));

      const tempBudgetMin = budgetParts[0];
      const tempBudgetMax =
        budgetParts.length === 2 ? budgetParts[1] : budgetParts[0];

      if (typeof tempBudgetMin === "number" && !isNaN(tempBudgetMin)) {
        budgetMin = tempBudgetMin;
      }
      if (typeof tempBudgetMax === "number" && !isNaN(tempBudgetMax)) {
        budgetMax = tempBudgetMax;
      }

      if (
        (budgetParts.length === 2 &&
          (budgetMin === null || budgetMax === null)) ||
        (budgetParts.length === 1 && budgetMin === null)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid budget format. Use 'min - max' or a single number.",
        });
      }

      // Parse deadline
      const parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline.getTime())) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid deadline date.",
        });
      }

      // Handle skills connection
      const skillConnects = await Promise.all(
        (skills || []).map(async (skillName) => {
          const skill = await ctx.db.skill.upsert({
            where: { name: skillName },
            update: {},
            create: {
              name: skillName,
              slug: skillName.toLowerCase().replace(/\s/g, "-"),
            },
          });
          return { id: skill.id };
        })
      );

      const job = await ctx.db.job.create({
        data: {
          seekerId,
          title,
          slug: title.toLowerCase().replace(/\s/g, "-") + "-" + Date.now(), // Simple slug generation
          description,
          location,
          budgetMin: budgetMin,
          budgetMax: budgetMax,
          deadline: parsedDeadline,
          requiredSkills: {
            connect: skillConnects,
          },
          status: "OPEN",
          currency: "ETB", // Default currency
        },
      });

      return job;
    }),

  listProposalsForJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { jobId } = input;
      return ctx.db.proposal.findMany({
        where: { jobId },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getProposal: protectedProcedure
    .input(z.object({ jobId: z.string(), providerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { jobId, providerId } = input;
      const proposal = await ctx.db.proposal.findFirst({
        where: {
          jobId,
          providerId,
        },
        select: {
          // Changed from include to select to explicitly get attachments
          id: true,
          jobId: true,
          providerId: true,
          coverLetter: true,
          price: true,
          currency: true,
          estimatedDays: true,
          status: true,
          attachments: true, // Explicitly select attachments
          createdAt: true,
          updatedAt: true,
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          job: {
            select: {
              title: true,
            },
          },
        },
      });

      if (!proposal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found.",
        });
      }

      return proposal;
    }),

  listProposalsForProvider: protectedProcedure
    .input(z.object({ providerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { providerId } = input;
      return ctx.db.proposal.findMany({
        where: { providerId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              seeker: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  acceptProposal: protectedProcedure
    .input(z.object({ proposalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { proposalId } = input;

      const updatedProposal = await ctx.db.proposal.update({
        where: { id: proposalId },
        data: { status: "ACCEPTED" },
        include: {
          job: {
            select: {
              id: true,
              seekerId: true,
            },
          },
        },
      });

      // Reject all other PENDING proposals for the same job and close the job
      if (updatedProposal.job?.id) {
        await ctx.db.proposal.updateMany({
          where: {
            jobId: updatedProposal.job.id,
            id: {
              not: proposalId,
            },
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
          },
        });

        await ctx.db.job.update({
          where: { id: updatedProposal.job.id },
          data: {
            status: "CLOSED",
            closedAt: new Date(),
          },
        });
      }

      // Optionally, create a contract here if the proposal is accepted
      // You might also want to notify the provider of the accepted proposal
      // and other providers of their rejected status.

      return updatedProposal;
    }),

  rejectProposal: protectedProcedure
    .input(z.object({ proposalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { proposalId } = input;

      const updatedProposal = await ctx.db.proposal.update({
        where: { id: proposalId },
        data: { status: "REJECTED" },
      });

      // Optionally, notify the provider.

      return updatedProposal;
    }),

  createProposal: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        proposalMessage: z.string().optional(),
        budgetOffer: z.string(), // Will be parsed to float
        estimatedDays: z.number().optional(),
        resumeUrl: z.string().optional(),
        coverLetterUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        jobId,
        proposalMessage,
        budgetOffer,
        estimatedDays,
        resumeUrl,
        coverLetterUrl,
      } = input;
      const providerId = (ctx.user as User).id; // Get providerId from ctx.user, cast to User

      // Basic validation for budgetOffer
      const price = parseFloat(budgetOffer);
      if (isNaN(price)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid budget offer. Must be a number.",
        });
      }

      // Check if the job exists
      const job = await ctx.db.job.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found.",
        });
      }

      // Create the proposal
      const proposal = await ctx.db.proposal.create({
        data: {
          jobId,
          providerId,
          coverLetter: proposalMessage,
          price,
          estimatedDays,
          attachments: [resumeUrl, coverLetterUrl].filter(Boolean) as string[], // Filter out undefined/null
          currency: job.currency, // Use job's currency
          status: "PENDING", // Default status
        },
      });

      return proposal;
    }),
});

export type JobRouter = typeof jobRouter;
