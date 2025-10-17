import { protectedProcedure, publicProcedure, router } from "../index";
import { userRouter } from "./user"; // Import the new userRouter morning reading
import { conversationRouter } from "./conversation";
import { messageRouter } from "./message";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  user: userRouter, // Add the userRouter
  conversation: conversationRouter,
  message: messageRouter,
});
export type AppRouter = typeof appRouter;
