import { includes, z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const conversationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return ctx.db.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // here it is limit the message to 1  but can be change
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),
});
