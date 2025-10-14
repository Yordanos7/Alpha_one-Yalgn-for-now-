/*
  Warnings:

  - You are about to drop the column `avatar` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "avatar",
DROP COLUMN "profileImage",
ADD COLUMN     "image" TEXT DEFAULT '/placeholder-avatar.jpg';
