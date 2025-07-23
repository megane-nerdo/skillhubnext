/*
  Warnings:

  - You are about to drop the column `userId` on the `Application` table. All the data in the column will be lost.
  - Added the required column `jobSeekerId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_employerId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "userId",
ADD COLUMN     "jobSeekerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
