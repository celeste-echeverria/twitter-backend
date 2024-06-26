/*
  Warnings:

  - The primary key for the `AccountType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AccountType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `accTypeId` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_accTypeId_fkey";

-- AlterTable
ALTER TABLE "AccountType" DROP CONSTRAINT "AccountType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "AccountType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accTypeId",
ADD COLUMN     "accTypeId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accTypeId_fkey" FOREIGN KEY ("accTypeId") REFERENCES "AccountType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
