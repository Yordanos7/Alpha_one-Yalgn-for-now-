import {
  initTRPC,
  TRPCError,
  type inferRouterInputs,
  type inferRouterOutputs,
} from "@trpc/server";
import superjson from "superjson"; // Import superjson
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import type { Session } from "better-auth"; // Ensure type-only import of Session
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"; // Ensure type-only import of CreateExpressContextOptions
import type { Server } from "socket.io"; // Import Server type for socket.io
import type { Context } from "./context"; // Import Context from context.ts

export const t = initTRPC.context<Context>().create({ transformer: superjson });

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

// AppRouter types will be defined in ./routers/types.ts to avoid circular dependencies.
// import { appRouter } from "./routers"; // Removed to avoid circular dependency

// export type AppRouter = typeof appRouter; // Removed
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
