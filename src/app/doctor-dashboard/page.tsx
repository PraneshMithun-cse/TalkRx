import type { Metadata } from "next";
import { ModulePageShell } from "@/components/talkrx/ModulePageShell";
import { DoctorDashboard } from "@/components/talkrx/DoctorDashboard";

export const metadata: Metadata = {
  title: "Doctor Clinical Dashboard — TalkRx",
  description:
    "Live OPD queue, structured HPI narratives with red-flag highlights, longitudinal timeline, medication reconciliation, and an interaction-checked prescription builder.",
};

export default function DoctorDashboardPage() {
  return (
    <ModulePageShell moduleId="doctor-dashboard">
      <DoctorDashboard />
    </ModulePageShell>
  );
}
