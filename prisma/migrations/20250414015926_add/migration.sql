/*
  Warnings:

  - A unique constraint covering the columns `[documentId,searchHistoryId]` on the table `DocumentToSearchHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DocumentToSearchHistory" DROP CONSTRAINT "DocumentToSearchHistory_documentId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentToSearchHistory" DROP CONSTRAINT "DocumentToSearchHistory_searchHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "SearchHistory" DROP CONSTRAINT "SearchHistory_createdById_fkey";

-- AlterTable
ALTER TABLE "DocumentToSearchHistory" ALTER COLUMN "relevantPages" SET DEFAULT ARRAY[]::INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "DocumentToSearchHistory_documentId_searchHistoryId_key" ON "DocumentToSearchHistory"("documentId", "searchHistoryId");

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentToSearchHistory" ADD CONSTRAINT "DocumentToSearchHistory_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentToSearchHistory" ADD CONSTRAINT "DocumentToSearchHistory_searchHistoryId_fkey" FOREIGN KEY ("searchHistoryId") REFERENCES "SearchHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
