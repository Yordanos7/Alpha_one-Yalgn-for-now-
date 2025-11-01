import { protectedProcedure, publicProcedure, router } from "../index";
import { userRouter } from "./user"; // Import the new userRouter morning reading
import { conversationRouter } from "./conversation";
import { messageRouter } from "./message";
import { jobRouter } from "./job"; // Import the new jobRouter
import { listingRouter } from "./listing";
import { categoryRouter } from "./category";
import { uploadRouter } from "./upload";
import { freelancerRouter } from "./freelancer"; // Import the new freelancerRouter

export interface UploadResponse {
  filePath: string;
}

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.user, // Use ctx.user directly
    };
  }),
  user: userRouter, // Add the userRouter
  conversation: conversationRouter,
  message: messageRouter,
  job: jobRouter, // Add the jobRouter
  listing: listingRouter, // Add the listingRouter here
  category: categoryRouter,
  upload: uploadRouter,
  freelancer: freelancerRouter, // Add the freelancerRouter
});
export type AppRouter = typeof appRouter;
