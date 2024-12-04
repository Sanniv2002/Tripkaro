"use server";

import prisma from "@/db";
import redis from "@/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateSettlements } from "@/lib/utils";

const ENABLE_CACHE = process.env.ENABLE_CACHE === "true";

function generateRoomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomCode = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomCode += characters[randomIndex];
  }

  return roomCode;
}

// Fetch trips that the current user is a participant in
async function fetchTrips() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const cacheKey = `user:${session.user.id}:trips`;

  try {
    // Check Redis cache first
    if (ENABLE_CACHE) {
      const cachedTrips = await redis.get(cacheKey);
      if (cachedTrips) {
        return JSON.parse(cachedTrips);
      }
    }

    // Fetch from the database
    const trips = await prisma.trip.findMany({
      where: {
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        participants: true,
        expenses: true,
      },
    });

    // Calculate the total expense from all trips
    const totalExpense = trips.reduce(
      (sum, trip) =>
        sum +
        trip.expenses.reduce((subSum, expense) => subSum + expense.amount, 0),
      0
    );

    // Filter active trips (those that are currently ongoing or will be in the future)
    const activeTrips = trips.filter(
      (trip) =>
        trip.startDate <= new Date() &&
        (trip.endDate === null || trip.endDate >= new Date())
    );

    // Calculate the total participants in all trips
    const totalParticipants = trips.reduce(
      (sum, trip) => sum + trip.participants.length,
      0
    );

    // Calculate the total expense for active trips
    const activeTripsTotalExpense = activeTrips.reduce(
      (sum, trip) =>
        sum +
        trip.expenses.reduce((subSum, expense) => subSum + expense.amount, 0),
      0
    );

    // Calculate the average cost per trip for all trips
    const averageCostPerTrip =
      trips.length > 0 ? totalExpense / trips.length : 0;

    // Calculate the average cost per active trip
    const averageCostPerActiveTrip =
      activeTrips.length > 0 ? activeTripsTotalExpense / activeTrips.length : 0;

    const result = {
      trips,
      activeTrips,
      metrics: {
        totalExpense,
        activeTripsCount: activeTrips.length,
        totalParticipants,
        averageCostPerTrip,
        averageCostPerActiveTrip,
      },
    };

    // Store the result in Redis for 10 minutes
    if (ENABLE_CACHE) {
      await redis.set(cacheKey, JSON.stringify(result), "EX", 600);
    }

    return result;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw new Error("Unable to fetch trips");
  }
}

// Add a new trip and associate it with the current user
async function addTrip(tripData: {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const roomCode = generateRoomCode();

    // Convert startDate and endDate to DateTime objects
    const startDate = new Date(tripData.startDate);
    const endDate = tripData.endDate ? new Date(tripData.endDate) : null;

    const newTrip = await prisma.trip.create({
      data: {
        name: tripData.name,
        description: tripData.description,
        startDate: startDate,
        endDate: endDate,
        participants: {
          connect: { id: session.user.id },
        },
        roomCode,
      },
    });

    const message = {
      content: `${session.user.viewName} just created a new trip! ✈️🌍`,
      avatar: session.user.avatar,
      userId: session.user.id,
    };

    await prisma.timeline.create({
      data: {
        message,
        trip: {
          connect: { id: newTrip.id },
        },
      },
    });

    if (ENABLE_CACHE) {
      await redis.del(`user:${session.user.id}:trips`);
    }

    return newTrip;
  } catch (error) {
    console.error("Error adding trip:", error);
    throw new Error("Unable to create trip");
  }
}

async function joinRoom(roomCode: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Find the trip using the provided room code
    const trip = await prisma.trip.findUnique({
      where: {
        roomCode,
      },
    });

    if (!trip) {
      throw new Error("Invalid room code");
    }

    if (ENABLE_CACHE) {
      await redis.del(`trip:${trip.id}:details`);
    }

    // Check if the user is already a participant
    const isParticipant = await prisma.trip.findFirst({
      where: {
        id: trip.id,
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
    });

    if (isParticipant) {
      throw new Error("You are already a participant in this trip");
    }

    // Add the user to the trip's participants
    const tripData = await prisma.trip.update({
      where: {
        id: trip.id,
      },
      data: {
        participants: {
          connect: { id: session.user.id },
        },
      },
    });

    const message = {
      content: `${session.user.viewName} just joined the adventure! 🚀`,
      avatar: session.user.avatar,
      userId: session.user.id,
    };

    await prisma.timeline.create({
      data: {
        message: message,
        trip: {
          connect: { id: tripData.id },
        },
      },
    });

    // Send notification
    const url = `https://${process.env.NEXT_PUBLIC_EVENTS_URL}/send-notification`;
    const payload = {
      tripId: tripData.id,
      message,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (ENABLE_CACHE) {
      await redis.del(`user:${session.user.id}:trips`);
    }

    return { success: true, message: "Joined room successfully", trip };
  } catch (error: any) {
    console.error("Error joining room:", error);
    throw new Error(error.message || "Unable to join room");
  }
}

async function getTripDetails(tripId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const cacheKey = `trip:${tripId}:details`;

  try {
    // Check Redis cache first
    if (ENABLE_CACHE) {
      const cachedTripDetails = await redis.get(cacheKey);
      if (cachedTripDetails) {
        console.log("Returning trip details from cache:", cacheKey);
        const tripDetails = JSON.parse(cachedTripDetails);
        // Override the userId field with the current user's ID
        tripDetails.userId = session.user.id;
        return tripDetails;
      }
    }

    // Fetch from the database
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        participants: true,
        expenses: {
          include: {
            user: {
              select: {
                viewName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!trip) {
      throw new Error("Trip not found");
    }

    const totalParticipants = trip.participants.length;

    if (totalParticipants === 0) {
      throw new Error("No participants found for the trip");
    }

    const members: any = trip.participants.map((participant) => {
      const totalSpent = trip.expenses
        .filter((expense) => expense.userId === participant.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return {
        name: participant.viewName,
        avatar: participant.avatar,
        spent: totalSpent,
      };
    });

    const totalExpense = trip.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const settlements = calculateSettlements(totalExpense, members);

    const owes: Record<string, number> = {};
    let sharedExpenses = 0; // Sum of the expenses where all participants are involved
    let sharedExpensesCount = 0;

    // Initialize owes object
    trip.participants.forEach((participant) => {
      owes[participant.id] = 0;
    });

    // Calculate owed amounts and shared expenses
    trip.expenses.forEach((expense) => {
      const participantsInExpense = trip.participants.filter(
        (participant) => expense.userId === participant.id || expense.userId
      );

      const isSharedByAll = participantsInExpense.length === totalParticipants;
      const sharedAmount = expense.amount / totalParticipants;

      if (isSharedByAll) {
        sharedExpenses += expense.amount;
        sharedExpensesCount++;
      }

      // Calculate individual participant's owed amounts
      trip.participants.forEach((participant) => {
        if (participant.id === expense.userId) {
          owes[participant.id] += expense.amount - sharedAmount;
        } else {
          owes[participant.id] -= sharedAmount;
        }
      });
    });

    const { participants, expenses, ...rest } = trip;

    const result = {
      userId: session?.user?.id,
      trip: rest,
      totalExpense,
      participants: trip.participants,
      expenses: trip.expenses.map((expense) => ({
        ...expense,
        creatorName: expense.user?.viewName || "Unknown",
        creatorAvatar: expense.user?.avatar,
      })),
      perPerson:
        sharedExpensesCount > 0 ? sharedExpenses / totalParticipants : 0,
      settlements,
    };

    // Store in Redis for 10 minutes
    if (ENABLE_CACHE) {
      await redis.set(cacheKey, JSON.stringify(result), "EX", 600);
    }

    return result;
  } catch (error) {
    console.error("Error fetching trip details:", error);
    throw new Error("Unable to fetch trip details");
  }
}

async function getTimeline(tripId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const timeline = await prisma.timeline.findMany({
      where: {
        tripId: tripId,
      },
      orderBy: {
        createdAt: "asc", // Fetch events in chronological order
      },
    });

    return timeline;
  } catch (error) {
    console.error("Error fetching timeline:", error);
    throw new Error("Failed to fetch timeline");
  }
}

async function getTripName(roomCode: string) {
  try {
    const trip = await prisma.trip.findUnique({
      where: {
        roomCode,
      },
    });

    if (!trip) {
      throw new Error("Invalid room code");
    }
    return trip;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export {
  fetchTrips,
  addTrip,
  joinRoom,
  getTripDetails,
  getTimeline,
  getTripName,
};
