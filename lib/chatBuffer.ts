import prisma from "@/db";

const chatBuffer: Array<{
  userId: string;
  context: object;
  prompt: string;
  botReply: string;
  timestamp: Date;
}> = [];

const BUFFER_LIMIT = 100;
const FLUSH_INTERVAL = 5000;

export async function addToBuffer(
  userId: string,
  context: object,
  prompt: string,
  botReply: string
) {
  chatBuffer.push({
    userId,
    context,
    prompt,
    botReply,
    timestamp: new Date(),
  });

  // Flush the buffer if it reaches the limit
  if (chatBuffer.length >= BUFFER_LIMIT) {
    await flushBuffer();
  }
}

// Function to flush the buffer to the database
export async function flushBuffer() {
  if (chatBuffer.length > 0) {
    const messagesToFlush = [...chatBuffer];
    chatBuffer.length = 0; // Clear the buffer

    try {
      await prisma.chatLog.createMany({
        data: messagesToFlush,
      });
      console.log("Flushed chat buffer to the database.");
    } catch (error) {
      console.error("Failed to flush chat buffer:", error);
    }
  }
}

// Periodic flushing
setInterval(async () => {
  await flushBuffer();
}, FLUSH_INTERVAL);

setInterval(async () => {
  await flushBuffer();
}, FLUSH_INTERVAL);

process.on("SIGTERM", async () => {
  await flushBuffer();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await flushBuffer();
  process.exit(0);
});
