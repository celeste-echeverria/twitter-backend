/*
  Warnings:

  - You are about to drop the column `reaction_count` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "reaction_count",
ADD COLUMN     "likes_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "replies_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "retweets_count" INTEGER NOT NULL DEFAULT 0;
