"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { PatientProfile, IndicLanguage } from "@/components/talkrx/types";
import { serializePatient, PATIENT_INCLUDE } from "@/lib/actions/serialize";
import { generateUniqueSerial } from "@/lib/actions/serial-gen";

export interface OnboardingStatus {
  onboarded: boolean;
  role: "PATIENT" | "DOCTOR" | "PHARMACY" | "STAFF" | null;
}

export async function getOnboardingStatusAction(): Promise<OnboardingStatus> {
  const { userId } = await auth();
  if (!userId) return { onboarded: false, role: null };
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  return { onboarded: !!user, role: user?.role ?? null };
}

export interface PatientOnboardingInput {
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  phone: string;
  bloodGroup: string;
  preferredLanguage: IndicLanguage;
}

export async function completePatientOnboardingAction(input: PatientOnboardingInput): Promise<PatientProfile> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in");

  const existing = await prisma.user.findUnique({ where: { clerkId: userId }, include: { patient: true } });
  if (existing?.patient) {
    const full = await prisma.patient.findUniqueOrThrow({ where: { id: existing.patient.id }, include: PATIENT_INCLUDE });
    return serializePatient(full);
  }

  const cu = await currentUser();
  const email = cu?.primaryEmailAddress?.emailAddress ?? undefined;
  const serial = await generateUniqueSerial();

  const patient = await prisma.$transaction(async (tx) => {
    const user =
      existing ??
      (await tx.user.create({
        data: { clerkId: userId, email, role: "PATIENT", name: input.name },
      }));

    const created = await tx.patient.create({
      data: {
        userId: user.id,
        serialNumber: serial,
        name: input.name,
        age: input.age,
        gender: input.gender,
        phone: input.phone,
        bloodGroup: input.bloodGroup,
        preferredLanguage: input.preferredLanguage,
        timeline: {
          create: [
            {
              date: new Date().toISOString().slice(0, 10),
              time: new Date().toISOString().slice(11, 16),
              title: "TalkRx Account Created",
              subtitle: "Self-registration",
              category: "case-taking",
              source: "patient-reported",
              sourceEntity: "TalkRx Account Service",
              facility: "TalkRx Digital",
              description: `${input.name} created a TalkRx account and received Serial Number ${serial}.`,
              tags: ["Account Created"],
            },
          ],
        },
      },
      include: PATIENT_INCLUDE,
    });
    return created;
  });

  return serializePatient(patient);
}

export interface StaffOnboardingInput {
  role: "DOCTOR" | "PHARMACY" | "STAFF";
  name: string;
  licenseNumber?: string;
  organization?: string;
  department?: string;
}

export async function completeStaffOnboardingAction(input: StaffOnboardingInput): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in");

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) return;

  const cu = await currentUser();
  const email = cu?.primaryEmailAddress?.emailAddress ?? undefined;

  await prisma.user.create({
    data: {
      clerkId: userId,
      email,
      role: input.role,
      name: input.name,
      licenseNumber: input.licenseNumber,
      organization: input.organization,
      department: input.department,
    },
  });
}
