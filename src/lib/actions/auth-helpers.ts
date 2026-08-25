import "server-only";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { User, UserRole } from "@prisma/client";

export async function getSignedInClerkId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export async function getCurrentUser(): Promise<User | null> {
  const clerkId = await getSignedInClerkId();
  if (!clerkId) return null;
  return prisma.user.findUnique({ where: { clerkId } });
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in, or onboarding not complete yet");
  return user;
}

export async function requireRole(...roles: UserRole[]): Promise<User> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new Error(`Forbidden — this action requires role: ${roles.join(" or ")}`);
  }
  return user;
}

export const STAFF_ROLES: UserRole[] = ["DOCTOR", "PHARMACY", "STAFF"];
