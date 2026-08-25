import "server-only";
import { prisma } from "@/lib/prisma";
import { generateSerialNumber } from "@/components/talkrx/serial";

export async function generateUniqueSerial(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const candidate = generateSerialNumber([]);
    const exists = await prisma.patient.findUnique({ where: { serialNumber: candidate } });
    if (!exists) return candidate;
  }
  throw new Error("Could not generate a unique serial number, please retry");
}
