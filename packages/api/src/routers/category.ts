import { publicProcedure, router } from "../index";

export const categoryRouter = router({
  getAll: publicProcedure.query(async ({ ctx: { prisma } }) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return categories;
  }),
});
