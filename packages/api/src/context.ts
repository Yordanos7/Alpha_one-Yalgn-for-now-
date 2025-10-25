import type { inferAsyncReturnType } from "@trpc/server"; // type-only import
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"; // type-only import
import type { Session } from "better-auth"; // type-only import
import type { Server } from "socket.io"; // Import Server from socket.io
import { auth } from "@Alpha/auth"; // Import Better-Auth instance
import { fromNodeHeaders } from "better-auth/node"; // Import fromNodeHeaders
import { prisma } from "./prisma"; // Import the singleton Prisma client

// Refine the User type to match what's typically available in the session/context
type ContextUser = {
  id: string;
  email: string | null;
  name: string;
  image: string | null;
  accountType: string | null;
  createdAt: Date;
  updatedAt: Date;
  bio: string | null;
  location: string | null;
  languages: string[];
  isActive: boolean;
  isVerified: boolean;
  coins: number;
  emailVerified: boolean;
};

interface CreateContextOptions {
  session: Session | null;
  user: ContextUser | null;
  io: Server;
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
}

export function createContextInner(opts: CreateContextOptions) {
  return {
    prisma,
    session: opts.session,
    user: opts.user,
    io: opts.io,
    req: opts.req,
    res: opts.res,
  };
}

export async function createContext(
  opts: CreateExpressContextOptions & { io: Server }
) {
  let session: Session | null = null;
  let user: ContextUser | null = null;

  try {
    const authResult = await auth.api.getSession({
      headers: fromNodeHeaders(opts.req.headers),
    });
    session = authResult?.session || null;

    if (session?.userId) {
      user = (await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          accountType: true,
          createdAt: true,
          updatedAt: true,
          bio: true,
          location: true,
          languages: true,
          isActive: true,
          isVerified: true,
          coins: true,
        },
      })) as ContextUser | null;
    }
  } catch (error) {
    console.error("Error fetching session or user in createContext:", error);
    // Continue with null session and user if an error occurs
  }

  return createContextInner({
    session,
    user,
    io: opts.io,
    req: opts.req,
    res: opts.res,
  });
}

export type Context = inferAsyncReturnType<typeof createContext>;
