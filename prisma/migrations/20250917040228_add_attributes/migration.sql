/*
  Warnings:

  - Added the required column `verifiedStatus` to the `Employer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Employer" ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "verifiedStatus" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
