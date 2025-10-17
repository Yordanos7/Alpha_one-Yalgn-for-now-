// packages/api/src/context.ts
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { auth } from "@Alpha/auth";
import db from "@Alpha/db";
import { Server as SocketIOServer } from "socket.io"; // Import SocketIOServer
import { fromNodeHeaders } from "better-auth/node";

// Modified createContext to accept io instance
export const createContext = async ({
  req,
  res,
  io,
}: CreateExpressContextOptions & { io: SocketIOServer }) => {
  const { session, user } = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return {
    db,
    session,
    user,
    io, // Add io to the context
    req, // Add req to the context
    res, // Add res to the context
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
