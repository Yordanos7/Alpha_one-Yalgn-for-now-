import { z } from "zod";
import { protectedProcedure, router } from "../index";
import { TRPCError } from "@trpc/server";
import { type User } from "@Alpha/db/prisma/generated/client"; // Import User type

export const jobRouter = router({
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

// Add type annotation for jobRouter to prevent portability issues
export type JobRouter = typeof jobRouter;
