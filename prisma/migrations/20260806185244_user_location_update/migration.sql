/*
  Warnings:

  - Made the column `geom` on table `UserLocation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserLocation" ADD COLUMN     "accuracy" INTEGER,
ADD COLUMN     "heading" INTEGER,
ADD COLUMN     "speed" DOUBLE PRECISION
