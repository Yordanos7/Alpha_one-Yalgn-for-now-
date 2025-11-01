-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('ENTRY', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "FreelancerLevel" AS ENUM ('JUNIOR', 'MID', 'SENIOR');

-- CreateEnum
CREATE TYPE "DeliveryTime" AS ENUM ('ONE_TO_THREE_DAYS', 'THREE_TO_SEVEN_DAYS', 'ONE_TO_TWO_WEEKS', 'TWO_TO_FOUR_WEEKS');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "averageRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "deliveryTime" "DeliveryTime",
ADD COLUMN     "experienceLevel" "ExperienceLevel",
ADD COLUMN     "freelancerLevel" "FreelancerLevel",
ADD COLUMN     "mainCategory" "CategoryEnum",
ADD COLUMN     "rateTypePreference" "JobType";
