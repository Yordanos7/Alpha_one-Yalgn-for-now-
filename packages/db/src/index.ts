const { PrismaClient } = await import("../prisma/generated/client/index.js");
export * from "../prisma/generated/client/index.js";

const prisma = new PrismaClient();

export default prisma;
