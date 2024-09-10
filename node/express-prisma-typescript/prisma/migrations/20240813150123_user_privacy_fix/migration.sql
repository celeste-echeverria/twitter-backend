/*
  Warnings:

  - You are about to drop the column `private` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "private",
ADD COLUMN     "privacy" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "updatedAt" DROP NOT NULL;
