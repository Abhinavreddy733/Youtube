/*
  Warnings:

  - You are about to drop the column `userId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SearchHistory` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `SearchHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_userId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "SearchHistory" DROP CONSTRAINT "SearchHistory_userId_fkey";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "SearchHistory" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
