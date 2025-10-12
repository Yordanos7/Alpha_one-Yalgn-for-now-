-- AlterTable
ALTER TABLE "user" ADD COLUMN     "goals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "howHear" TEXT,
ADD COLUMN     "howHearOther" TEXT,
ADD COLUMN     "individualFocus" TEXT,
ADD COLUMN     "organizationPurpose" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "userType" TEXT;
