/*
  Warnings:

  - You are about to drop the column `categoryId` on the `listings` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('TECHNOLOGY', 'CREATIVE', 'BUSINESS_FINANCE', 'HEALTHCARE', 'EDUCATION', 'TRADES_SERVICES', 'HOSPITALITY_RETAIL');

-- DropForeignKey
ALTER TABLE "public"."listings" DROP CONSTRAINT "listings_categoryId_fkey";

-- AlterTable
ALTER TABLE "listings" DROP COLUMN "categoryId",
ADD COLUMN     "category" "CategoryEnum",
ADD COLUMN     "videos" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "public"."categories";
