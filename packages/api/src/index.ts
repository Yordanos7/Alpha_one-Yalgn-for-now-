import {
  initTRPC,
  TRPCError,
  type inferRouterInputs, // Changed to type-only import
  type inferRouterOutputs, // Changed to type-only import
} from "@trpc/server";
import superjson from "superjson"; // Import superjson
import type { Context } from "./context"; // Ensure type-only import of Context

export const t = initTRPC.context<Context>().transformer(superjson).create();

export const router: typeof t.router = t.router;

export const publicProcedure: typeof t.procedure = t.procedure;

export const protectedProcedure: typeof t.procedure = t.procedure.use(
  ({ ctx, next }) => {
    if (!ctx.session || !ctx.user) {
      // Ensure both session and user are present
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
        cause: "No session or user",
      });
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        user: ctx.user, // Explicitly add user to the context for type narrowing
      },
    });
  }
);

// talking about this code file it is for the api and  the main work for this is to create the tRPC router all the procedures over the api calls
// by the way this project is gone finish this day by the way I am hard to day

// Define AppRouter here
import { appRouter } from "./routers"; // Import appRouter to infer types from it

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
