-- CreateEnum
CREATE TYPE "SampleType" AS ENUM ('GREEN', 'ROASTED', 'BREWED');

-- CreateEnum
CREATE TYPE "RoastLevel" AS ENUM ('LIGHT', 'MEDIUM', 'MEDIUM_DARK', 'DARK');

-- CreateTable
CREATE TABLE "cuppings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuppings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "samples" (
    "id" TEXT NOT NULL,
    "cuppingId" TEXT NOT NULL,
    "sampleId" TEXT NOT NULL,
    "sampleType" "SampleType" NOT NULL,
    "origin" TEXT NOT NULL,
    "process" TEXT NOT NULL,
    "variety" TEXT,
    "elevation" TEXT,
    "roaster" TEXT,
    "roastDate" TIMESTAMP(3),
    "roastLevel" "RoastLevel",
    "roasterNotes" TEXT,
    "primaryDefects" INTEGER NOT NULL DEFAULT 0,
    "secondaryDefects" INTEGER NOT NULL DEFAULT 0,
    "moisture" DOUBLE PRECISION,
    "waterActivity" DOUBLE PRECISION,
    "density" TEXT,
    "screenSize" TEXT,
    "fragrance" DOUBLE PRECISION,
    "aroma" DOUBLE PRECISION,
    "flavor" DOUBLE PRECISION,
    "aftertaste" DOUBLE PRECISION,
    "acidityIntensity" DOUBLE PRECISION,
    "acidityQuality" DOUBLE PRECISION,
    "bodyLevel" DOUBLE PRECISION,
    "bodyQuality" DOUBLE PRECISION,
    "uniformity" DOUBLE PRECISION,
    "balance" DOUBLE PRECISION,
    "cleanCup" DOUBLE PRECISION,
    "sweetness" DOUBLE PRECISION,
    "overall" DOUBLE PRECISION,
    "taint" INTEGER NOT NULL DEFAULT 0,
    "fault" INTEGER NOT NULL DEFAULT 0,
    "roastDefects" TEXT,
    "finalScore" DOUBLE PRECISION,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "samples_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cuppings" ADD CONSTRAINT "cuppings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "samples" ADD CONSTRAINT "samples_cuppingId_fkey" FOREIGN KEY ("cuppingId") REFERENCES "cuppings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "samples" ADD CONSTRAINT "samples_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
