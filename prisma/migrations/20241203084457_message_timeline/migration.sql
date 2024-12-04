/*
  Warnings:

  - Added the required column `message` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timeline" ADD COLUMN     "message" TEXT NOT NULL;
