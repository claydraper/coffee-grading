/*
  Warnings:

  - You are about to drop the column `acidityIntensity` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `acidityQuality` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `aroma` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `bodyLevel` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `bodyQuality` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `fragrance` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `sampleType` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `waterActivity` on the `samples` table. All the data in the column will be lost.
  - The `elevation` column on the `samples` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `primaryDefects` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `secondaryDefects` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `flavor` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(4,2)`.
  - You are about to alter the column `aftertaste` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(4,2)`.
  - You are about to alter the column `uniformity` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `SmallInt`.
  - You are about to alter the column `balance` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(4,2)`.
  - You are about to alter the column `cleanCup` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `SmallInt`.
  - You are about to alter the column `sweetness` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `SmallInt`.
  - You are about to alter the column `overall` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(4,2)`.
  - You are about to alter the column `taint` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `fault` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `finalScore` on the `samples` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(4,2)`.
  - Made the column `flavor` on table `samples` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aftertaste` on table `samples` required. This step will fail if there are existing NULL values in that column.
  - Made the column `balance` on table `samples` required. This step will fail if there are existing NULL values in that column.
  - Made the column `overall` on table `samples` required. This step will fail if there are existing NULL values in that column.
  - Made the column `finalScore` on table `samples` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "samples" DROP COLUMN "acidityIntensity",
DROP COLUMN "acidityQuality",
DROP COLUMN "aroma",
DROP COLUMN "bodyLevel",
DROP COLUMN "bodyQuality",
DROP COLUMN "fragrance",
DROP COLUMN "sampleType",
DROP COLUMN "waterActivity",
ADD COLUMN     "acidity" DECIMAL(4,2) NOT NULL DEFAULT 6.00,
ADD COLUMN     "body" DECIMAL(4,2) NOT NULL DEFAULT 6.00,
ADD COLUMN     "break" DECIMAL(4,2) NOT NULL DEFAULT 6.00,
ADD COLUMN     "dry" DECIMAL(4,2) NOT NULL DEFAULT 6.00,
ADD COLUMN     "fragranceAroma" DECIMAL(4,2) NOT NULL DEFAULT 6.00,
DROP COLUMN "elevation",
ADD COLUMN     "elevation" SMALLINT DEFAULT 0,
ALTER COLUMN "primaryDefects" DROP NOT NULL,
ALTER COLUMN "primaryDefects" SET DATA TYPE SMALLINT,
ALTER COLUMN "secondaryDefects" DROP NOT NULL,
ALTER COLUMN "secondaryDefects" SET DATA TYPE SMALLINT,
ALTER COLUMN "flavor" SET NOT NULL,
ALTER COLUMN "flavor" SET DEFAULT 6.00,
ALTER COLUMN "flavor" SET DATA TYPE DECIMAL(4,2),
ALTER COLUMN "aftertaste" SET NOT NULL,
ALTER COLUMN "aftertaste" SET DEFAULT 6.00,
ALTER COLUMN "aftertaste" SET DATA TYPE DECIMAL(4,2),
ALTER COLUMN "uniformity" SET DATA TYPE SMALLINT,
ALTER COLUMN "balance" SET NOT NULL,
ALTER COLUMN "balance" SET DEFAULT 6.00,
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(4,2),
ALTER COLUMN "cleanCup" SET DATA TYPE SMALLINT,
ALTER COLUMN "sweetness" SET DATA TYPE SMALLINT,
ALTER COLUMN "overall" SET NOT NULL,
ALTER COLUMN "overall" SET DEFAULT 6.00,
ALTER COLUMN "overall" SET DATA TYPE DECIMAL(4,2),
ALTER COLUMN "taint" SET DATA TYPE SMALLINT,
ALTER COLUMN "fault" SET DATA TYPE SMALLINT,
ALTER COLUMN "finalScore" SET NOT NULL,
ALTER COLUMN "finalScore" SET DEFAULT 0.00,
ALTER COLUMN "finalScore" SET DATA TYPE DECIMAL(4,2);

-- DropEnum
DROP TYPE "public"."SampleType";
