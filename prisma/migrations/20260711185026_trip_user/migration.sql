/*
  Warnings:

  - You are about to drop the column `userId` on the `Trip` table. All the data in the column will be lost.
  - The primary key for the `UserLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `geom` on table `UserLocation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_userId_fkey";

-- DropIndex
DROP INDEX "Trip_userId_startedAt_idx";

-- DropIndex
DROP INDEX "UserLocation_geom_gist";

-- DropIndex
DROP INDEX "UserLocation_geom_idx";

-- DropIndex
DROP INDEX "UserLocation_recordedAt_idx";

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "UserLocation" DROP CONSTRAINT "UserLocation_pkey",
ALTER COLUMN "recordedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("userId", "recordedAt");

-- CreateTable
CREATE TABLE "TripUser" (
    "tripId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TripUser_pkey" PRIMARY KEY ("tripId","userId")
);

-- CreateIndex
CREATE INDEX "TripUser_userId_idx" ON "TripUser"("userId");

-- AddForeignKey
ALTER TABLE "TripUser" ADD CONSTRAINT "TripUser_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripUser" ADD CONSTRAINT "TripUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
