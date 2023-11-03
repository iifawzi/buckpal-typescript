/*
  Warnings:

  - You are about to drop the column `localDateTime` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "localDateTime",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;
