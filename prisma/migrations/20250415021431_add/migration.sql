-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "DocumentToSearchHistory" ALTER COLUMN "relevantPages" DROP DEFAULT;
