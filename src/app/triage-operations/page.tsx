import type { Metadata } from "next";
import { ModulePageShell } from "@/components/talkrx/ModulePageShell";
import { HospitalOperations } from "@/components/talkrx/HospitalOperations";

export const metadata: Metadata = {
  title: "Hospital & Clinic Operations — TalkRx",
  description:
    "OPD queue management, live red-flag triage broadcast, operational capacity analytics, and FHIR R4 / ABDM gateway export status.",
};

export default function TriageOperationsPage() {
  return (
    <ModulePageShell moduleId="triage-operations">
      <HospitalOperations />
    </ModulePageShell>
  );
}
