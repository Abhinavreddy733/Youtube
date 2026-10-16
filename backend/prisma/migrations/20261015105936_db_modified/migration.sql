/*
  Warnings:

  - You are about to drop the column `platlistName` on the `PlaylistContent` table. All the data in the column will be lost.
  - You are about to drop the column `playlistCreatedAt` on the `PlaylistContent` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `PlaylistContent` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlistId` to the `PlaylistContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlaylistContent" DROP COLUMN "platlistName",
DROP COLUMN "playlistCreatedAt",
DROP COLUMN "visibility",
ADD COLUMN     "contentAddedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "playlistId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistContent" ADD CONSTRAINT "PlaylistContent_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
