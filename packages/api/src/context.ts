import { PrismaClient } from "@prisma/client";
import type { inferAsyncReturnType } from "@trpc/server"; // type-only import
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"; // type-only import
import type { Session } from "better-auth"; // type-only import
import type { Server } from "socket.io"; // Import Server type for socket.io
import type { User as PrismaUser } from "@prisma/client"; // Import Prisma's User type

// Refine the User type to match what's typically available in the session/context
type ContextUser = Pick<
  PrismaUser,
  | "id"
  | "email"
  | "name"
  | "image"
  | "accountType"
  | "createdAt"
  | "updatedAt"
  | "bio"
  | "location"
  | "languages"
  | "isActive"
  | "isVerified"
  | "coins"
>;

interface CreateContextOptions {
  // Removed extends CreateExpressContextOptions
  prisma: PrismaClient;
  session: Session | null;
  user: ContextUser | null; // Use the refined ContextUser type
  io: Server; // Add socket.io server instance to context
  req: CreateExpressContextOptions["req"]; // Add req
  res: CreateExpressContextOptions["res"]; // Add res
}

export function createContextInner(opts: CreateContextOptions) {
  return {
    prisma: opts.prisma,
    session: opts.session,
    user: opts.user,
    io: opts.io, // Include io in the context
    req: opts.req,
    res: opts.res,
  };
}

export async function createContext(opts: CreateExpressContextOptions) {
  // Changed parameter name to opts
  const prisma = new PrismaClient();
  // In a real application, you would fetch the session and user based on the request
  // For now, we'll mock it or assume it's handled by middleware before tRPC
  const session: Session | null = null; // Placeholder
  const user: ContextUser | null = null; // Use the refined ContextUser type
  const io: Server = {} as Server; // Placeholder for socket.io server

  return createContextInner({
    prisma,
    session,
    user,
    io, // Pass io to createContextInner
    req: opts.req, // Use opts.req
    res: opts.res, // Use opts.res
  });
}

export type Context = inferAsyncReturnType<typeof createContext>;
