-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "mainPostId" UUID;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_mainPostId_fkey" FOREIGN KEY ("mainPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
