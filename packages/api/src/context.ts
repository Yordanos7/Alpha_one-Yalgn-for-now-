// packages/api/src/context.ts
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { auth } from "@Alpha/auth";
import db from "@Alpha/db";
import { Server as SocketIOServer } from "socket.io";
import { fromNodeHeaders } from "better-auth/node";
import { PrismaClient } from "@Alpha/db/prisma/generated/client"; // Corrected import path for PrismaClient

// Modified createContext to accept io instance
export const createContext = async ({
  req,
  res,
  io,
}: CreateExpressContextOptions & { io: SocketIOServer }) => {
  const authResult = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  const session = authResult?.session || null;
  const user = authResult?.user || null;

  const context = {
    db,
    session,
    user,
    io,
    req,
    res,
  };
  console.log("tRPC Context created:", context); // Add logging
  return context;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
