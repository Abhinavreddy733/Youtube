/*
  Warnings:

  - A unique constraint covering the columns `[channelProfile]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,profileId]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "subCount" SET DEFAULT 0,
ALTER COLUMN "totalViewCount" SET DEFAULT 0,
ALTER COLUMN "totalRevemue" SET DEFAULT 0,
ALTER COLUMN "totalVideos" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channelProfile_key" ON "Channel"("channelProfile");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_userId_profileId_key" ON "Channel"("userId", "profileId");
