/*
  Warnings:

  - You are about to drop the column `repliesToPostId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `accTypeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AccountType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReactionType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_repliesToPostId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_reactionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_accTypeId_fkey";

-- DropIndex
DROP INDEX "Reaction_userId_postId_reactionTypeId_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "repliesToPostId",
ADD COLUMN     "parentId" UUID;

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accTypeId",
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "AccountType";

-- DropTable
DROP TABLE "ReactionType";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
