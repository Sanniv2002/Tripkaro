/*
  Warnings:

  - You are about to drop the column `avatar` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `viewName` on the `Timeline` table. All the data in the column will be lost.
  - Added the required column `message` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "avatar",
DROP COLUMN "type",
DROP COLUMN "viewName",
ADD COLUMN     "message" TEXT NOT NULL;

-- DropEnum
DROP TYPE "TimelineType";
