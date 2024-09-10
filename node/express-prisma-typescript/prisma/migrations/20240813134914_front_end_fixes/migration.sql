/*
  Warnings:

  - You are about to drop the column `reactionTypeId` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,postId,type]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "reactionTypeId";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_postId_type_key" ON "Reaction"("userId", "postId", "type");
