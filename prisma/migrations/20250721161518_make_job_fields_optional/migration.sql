-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "industryId" TEXT,
ADD COLUMN     "salary" TEXT;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
