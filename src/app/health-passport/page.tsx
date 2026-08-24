import type { Metadata } from "next";
import { ModulePageShell } from "@/components/talkrx/ModulePageShell";
import { PatientPassport } from "@/components/talkrx/PatientPassport";

export const metadata: Metadata = {
  title: "Patient Health Passport — TalkRx",
  description:
    "ABHA-linked digital Health Passport, printable emergency QR card, granular revocable consent controls, and an immutable audit ledger.",
};

export default function HealthPassportPage() {
  return (
    <ModulePageShell moduleId="health-passport">
      <PatientPassport />
    </ModulePageShell>
  );
}
