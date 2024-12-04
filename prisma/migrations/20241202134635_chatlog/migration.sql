-- CreateEnum
CREATE TYPE "TimelineType" AS ENUM ('join', 'expense', 'update');

-- CreateTable
CREATE TABLE "Timeline" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "fromAvatar" TEXT NOT NULL,
    "toAvatar" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "TimelineType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tripId" TEXT NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatLog" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "context" JSONB NOT NULL,
    "prompt" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Timeline_tripId_key" ON "Timeline"("tripId");

-- CreateIndex
CREATE INDEX "ChatLog_userId_timestamp_idx" ON "ChatLog"("userId", "timestamp");

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
