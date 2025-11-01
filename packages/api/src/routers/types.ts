import { z } from "zod";
import type { appRouter } from "./index"; // Import appRouter from the main router file
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const ListingCreateInput = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  currency: z.enum(["ETB", "USD"]).default("ETB"),
  deliveryDays: z.number().int().positive().optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

// Define AppRouter here to avoid circular dependencies with packages/api/src/index.ts
export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
