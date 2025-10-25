import { PrismaClient } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { Session } from "better-auth"; // Assuming better-auth is used for session management

interface CreateContextOptions extends CreateExpressContextOptions {
  prisma: PrismaClient;
  session: Session | null;
  user: { id: string; email: string; accountType: string } | null; // Simplified user type
}

export function createContextInner(opts: CreateContextOptions) {
  return {
    prisma: opts.prisma,
    session: opts.session,
    user: opts.user,
    req: opts.req,
    res: opts.res,
  };
}

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const prisma = new PrismaClient();
  // In a real application, you would fetch the session and user based on the request
  // For now, we'll mock it or assume it's handled by middleware before tRPC
  const session: Session | null = null; // Placeholder
  const user: { id: string; email: string; accountType: string } | null = null; // Placeholder

  return createContextInner({
    prisma,
    session,
    user,
    req,
    res,
  });
}

export type Context = inferAsyncReturnType<typeof createContext>;
