/*
  Warnings:

  - Added the required column `dateOfBirth` to the `client_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `client_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `client_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClientGoal" AS ENUM ('LOSE_FAT', 'BUILD_MUSCLE', 'MAINTENANCE', 'PERFORMANCE');

-- CreateEnum
CREATE TYPE "ClientBudget" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'NO_BUDGET');

-- CreateEnum
CREATE TYPE "ClientGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "client_profiles" ADD COLUMN     "budget" "ClientBudget",
ADD COLUMN     "cityId" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "ClientGender",
ADD COLUMN     "goal" "ClientGoal",
ADD COLUMN     "height" DECIMAL(4,2),
ADD COLUMN     "initialWeight" DECIMAL(5,2),
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "municipalityId" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "stateId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT;

-- CreateIndex
CREATE INDEX "client_profiles_stateId_idx" ON "client_profiles"("stateId");

-- CreateIndex
CREATE INDEX "client_profiles_municipalityId_idx" ON "client_profiles"("municipalityId");

-- CreateIndex
CREATE INDEX "client_profiles_postalCode_idx" ON "client_profiles"("postalCode");

-- AddForeignKey
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
