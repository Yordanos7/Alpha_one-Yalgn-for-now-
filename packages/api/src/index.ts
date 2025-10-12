import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context"; // Revert to type-only import of Context

export const t = initTRPC.context<Context>().create();

export const router: typeof t.router = t.router;

export const publicProcedure: typeof t.procedure = t.procedure;

export const protectedProcedure: typeof t.procedure = t.procedure.use(
  ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
        cause: "No session",
      });
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  }
);
