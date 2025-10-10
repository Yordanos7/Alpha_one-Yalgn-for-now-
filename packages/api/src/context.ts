import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@Alpha/auth";
import prisma from "@Alpha/db"; // Import prisma
import type { Request, Response } from "express"; // Import Request and Response types

// Define a custom context interface to include req and res
interface CustomContext {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  prisma: typeof prisma;
  req: Request;
  res: Response;
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<CustomContext> {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(opts.req.headers),
  });
  return {
    session,
    prisma, // Add prisma to the context
    req: opts.req as Request, // Cast req to Request
    res: opts.res as Response, // Cast res to Response
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
