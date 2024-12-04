/*
  Warnings:

  - You are about to drop the column `from` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `fromAvatar` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `toAvatar` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Timeline` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `Timeline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewName` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "from",
DROP COLUMN "fromAvatar",
DROP COLUMN "timestamp",
DROP COLUMN "to",
DROP COLUMN "toAvatar",
DROP COLUMN "updatedAt",
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "viewName" TEXT NOT NULL;
