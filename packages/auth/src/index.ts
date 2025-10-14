import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@Alpha/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
  },
  session: {
    // Add session configuration
    freshAge: 60 * 60 * 24 * 7, // 7 days
    callbacks: {
      refresh: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (user) {
          return {
            ...user,
            image: user.image,
          };
        }
        return user;
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
});
