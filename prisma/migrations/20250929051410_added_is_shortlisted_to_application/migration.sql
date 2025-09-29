/*
  Warnings:

  - You are about to drop the column `status` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "status",
ADD COLUMN     "isShortlisted" BOOLEAN NOT NULL DEFAULT false;
