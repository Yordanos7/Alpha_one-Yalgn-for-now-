import { publicProcedure, router } from "../index";
import { CategoryEnum } from "@Alpha/db/prisma/generated/client"; // Import the enum

export const categoryRouter = router({
  getAll: publicProcedure.query(() => {
    // Return enum values directly
    const categories: { id: string; name: string; slug: string }[] =
      Object.values(CategoryEnum).map((category) => ({
        id: category as string, // Explicitly cast to string
        name: (category as string).replace(/_/g, " "), // Convert enum name to readable format
        slug: (category as string).toLowerCase().replace(/_/g, "-"), // Generate slug
      }));
    return { categories }; // Return as an object with a 'categories' key
  }),
});
