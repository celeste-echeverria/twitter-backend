/*
  Warnings:

  - You are about to drop the column `mainPostId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_mainPostId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mainPostId",
ADD COLUMN     "repliesToPostId" UUID;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_repliesToPostId_fkey" FOREIGN KEY ("repliesToPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
