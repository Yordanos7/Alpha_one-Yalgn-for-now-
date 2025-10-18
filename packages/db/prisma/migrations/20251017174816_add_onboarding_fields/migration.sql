-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "goals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "howHear" TEXT,
ADD COLUMN     "howHearOther" TEXT,
ADD COLUMN     "individualFocus" TEXT,
ADD COLUMN     "organizationPurpose" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "accountType" "AccountType",
ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false;
