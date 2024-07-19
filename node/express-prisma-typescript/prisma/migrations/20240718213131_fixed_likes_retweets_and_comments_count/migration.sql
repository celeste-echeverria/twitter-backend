/*
  Warnings:

  - You are about to drop the column `likes_count` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `replies_count` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `retweets_count` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likes_count",
DROP COLUMN "replies_count",
DROP COLUMN "retweets_count",
ADD COLUMN     "qtyComments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "qtyLikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "qtyRetweets" INTEGER NOT NULL DEFAULT 0;
