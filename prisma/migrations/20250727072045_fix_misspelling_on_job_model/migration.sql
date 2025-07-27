/*
  Warnings:

  - You are about to drop the column `carreerOpportunities` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "carreerOpportunities",
ADD COLUMN     "careerOpportunities" TEXT[];
