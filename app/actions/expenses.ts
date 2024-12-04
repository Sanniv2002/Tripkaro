"use server";

import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import redis from "@/redis";

interface AddExpenseInput {
  tripId: string;
  title: string;
  date: Date;
  amount: number;
  userId: string;
  category?: string;
  notes?: string;
}

type Member = {
  name: string;
  spent: number;
};

// Utility function to handle Redis calls based on the ENABLE_CACHE environment variable
const shouldUseCache = () => process.env.ENABLE_CACHE === "true";

async function addExpense(input: AddExpenseInput) {
  const { tripId, title, date, amount, userId, category, notes } = input;
  if (!title && !amount) {
    throw new Error("Got missing arguments");
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Ensure the user is part of the trip
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { participants: true },
    });

    if (!trip) {
      throw new Error("Trip not found");
    }

    // Check if the provided userId is a participant in the trip
    const isUserParticipant = trip.participants.some(
      (participant) => participant.id === userId
    );

    if (!isUserParticipant) {
      throw new Error(
        `User with ID ${userId} is not a participant in the trip`
      );
    }

    // Create the expense and associate it with the given userId
    const newExpense = await prisma.expense.create({
      data: {
        title,
        amount,
        date,
        category,
        notes,
        tripId,
        userId, // Associate the expense with the provided userId
      },
      include: {
        user: true,
      },
    });

    // Update the trip's participants with the new expense
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        expenses: {
          connect: { id: newExpense.id },
        },
      },
    });

    const message = {
      content: `${session.user.viewName} added an expense of ₹${amount}. Time to keep track! 🧾`,
      avatar: session.user.avatar,
      userId: session.user.id
    };

    await prisma.timeline.create({
      data: {
        message,
        trip: {
          connect: { id: tripId },
        },
      },
    });

    const url = `https://${process.env.NEXT_PUBLIC_EVENTS_URL}/send-notification`;
    const payload = {
      tripId,
      message,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Delete the cache related to the trip details if caching is enabled
    if (shouldUseCache()) {
      await redis.del(`trip:${tripId}:details`);
    }

    return { success: true, expense: newExpense };
  } catch (error) {
    console.error("Error adding expense:", error);
    throw new Error("Unable to add expense");
  }
}

async function deleteExpense(expenseId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Find the expense to ensure it exists and check ownership
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: { trip: true }, // Optionally include related trip details
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    // Optionally check if the user owns the expense or is part of the trip
    console.log(session.user.id, expense.userId);
    if (expense.userId !== session.user.id) {
      throw new Error("You are not authorized to delete this expense");
    }

    // Delete the expense
    await prisma.expense.delete({
      where: { id: expenseId },
    });

    const message = {
      content: `${session.user.viewName} removed an expense. Budget updated! ✂️`,
      avatar: session.user.avatar,
      userId: session.user.id
    };

    await prisma.timeline.create({
      data: {
        message,
        trip: {
          connect: { id: expense.trip.id },
        },
      },
    });

    // Send notification
    const url = `https://${process.env.NEXT_PUBLIC_EVENTS_URL}/send-notification`;
    const payload = {
      tripId: expense.trip.id,
      message,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Delete the cache related to the trip details if caching is enabled
    if (shouldUseCache() && expense.tripId) {
      await redis.del(`trip:${expense.tripId}:details`);
    }

    return { success: true, message: "Expense deleted successfully" };
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Unable to delete expense");
  }
}

export { addExpense, deleteExpense };