"use server";

import model from "@/gemini";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { addToBuffer } from "@/lib/chatBuffer";
import prisma from "@/db";

export async function generateResponseAction(
  context: object,
  prompt: string
): Promise<any> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const botReply = await generateResponse(context, prompt);
  await addToBuffer(session?.user?.id, context, prompt, botReply);
  return { message: botReply };
}

async function generateResponse(
  prelude: object,
  prompt: string
): Promise<string> {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function loadChatsAction(
  cursor?: number,
  limit: number = 20
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

  const chats = await prisma.chatLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    take: limit,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
  });

  return chats.map((chat) => ({
    id: chat.id,
    role: chat.botReply ? "assistant" : "user",
    prompt: chat.prompt,
    content: chat.botReply,
    timestamp: chat.timestamp,
  }));
}


