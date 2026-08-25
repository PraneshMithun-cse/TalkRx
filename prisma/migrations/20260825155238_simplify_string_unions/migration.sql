/*
  Warnings:

  - The `queueStatus` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `granteeType` on the `ConsentAuthorization` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `accessLevel` on the `ConsentAuthorization` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `source` on the `ExtractedMedication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `source` on the `PatientCondition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `RedFlagAlert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `source` on the `TimelineEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ConsentAuthorization" DROP COLUMN "granteeType",
ADD COLUMN     "granteeType" TEXT NOT NULL,
DROP COLUMN "accessLevel",
ADD COLUMN     "accessLevel" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExtractedMedication" DROP COLUMN "source",
ADD COLUMN     "source" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "queueStatus",
ADD COLUMN     "queueStatus" TEXT NOT NULL DEFAULT 'waiting';

-- AlterTable
ALTER TABLE "PatientCondition" DROP COLUMN "source",
ADD COLUMN     "source" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RedFlagAlert" DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimelineEvent" DROP COLUMN "source",
ADD COLUMN     "source" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AccessLevel";

-- DropEnum
DROP TYPE "GranteeType";

-- DropEnum
DROP TYPE "ProvenanceSource";

-- DropEnum
DROP TYPE "QueueStatus";

-- DropEnum
DROP TYPE "RedFlagCategory";
