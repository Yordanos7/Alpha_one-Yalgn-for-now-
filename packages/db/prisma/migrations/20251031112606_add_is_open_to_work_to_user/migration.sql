-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "isPublicFreelancer" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isOpenToWork" BOOLEAN NOT NULL DEFAULT false;
