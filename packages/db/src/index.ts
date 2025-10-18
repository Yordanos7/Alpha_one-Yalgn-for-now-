import { PrismaClient, AccountType } from "../prisma/generated"; // Import AccountType
const prisma = new PrismaClient();

export default prisma;
export { AccountType }; // Re-export AccountType
