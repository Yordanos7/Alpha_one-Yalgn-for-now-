// packages/api/src/context.ts
import { PrismaClient } from "@prisma/client";
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { type Session } from "lucia";
import { auth } from "@alpha/auth";
import { db } from "@alpha/db";
import { Server as SocketIOServer } from "socket.io"; // Import SocketIOServer

interface AuthContext {
  session: Session | null;
}

// Modified createContext to accept io instance
export const createContext = async (
  { req, res }: CreateExpressContextOptions,
  io: SocketIOServer // Accept io instance
) => {
  const sessionId = auth.readSessionCookie(req.headers.cookie ?? "");
  const { session, user } = await auth.validateSession(sessionId);

  if (session && session.fresh) {
    res.appendHeader(
      "Set-Cookie",
      auth.createSessionCookie(session.id).serialize()
    );
  }
  if (!session) {
    res.appendHeader("Set-Cookie", auth.createBlankSessionCookie().serialize());
  }

  return {
    db,
    session,
    user,
    io, // Add io to the context
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
