/*
  Warnings:

  - Added the required column `botReply` to the `ChatLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ChatLog_userId_timestamp_idx";

-- AlterTable
ALTER TABLE "ChatLog" ADD COLUMN     "botReply" TEXT NOT NULL;
