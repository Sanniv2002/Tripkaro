"use server";

import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import redis from "@/redis";

const ENABLE_CACHE = process.env.ENABLE_CACHE === "true";

async function fetchUserDetails() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const cacheKey = `user:${session.user.id}:details`;

  try {
    // If caching is enabled, check Redis cache first
    if (ENABLE_CACHE) {
      const cachedUser = await redis.get(cacheKey);
      if (cachedUser) {
        return { success: true, user: JSON.parse(cachedUser) };
      }
    }

    // Fetch user details from the database
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        viewName: true,
        avatar: true,
      },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // If caching is enabled, store user details in Redis
    if (ENABLE_CACHE) {
      await redis.set(cacheKey, JSON.stringify(user), "EX", 600); // Cache for 10 minutes
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, message: "Failed to fetch user details" };
  }
}

async function updateUser(viewName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Check if the user already exists
    const isExistingUser = await prisma.user.findUnique({
      where: {
        id: session?.user.id as string,
      },
    });

    if (!isExistingUser) {
      throw new Error("User not found");
    }

    // Update the user's viewName in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: session?.user.id as string,
      },
      data: {
        viewName,
      },
    });

    // Clear cache for user details if caching is enabled
    if (ENABLE_CACHE) {
      const cacheKey = `user:${session.user.id}:details`;
      await redis.del(cacheKey);
    }

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update user" };
  }
}

export { fetchUserDetails, updateUser };
