import type { Metadata } from "next";
import { ModulePageShell } from "@/components/talkrx/ModulePageShell";
import { PharmacyNetwork } from "@/components/talkrx/PharmacyNetwork";

export const metadata: Metadata = {
  title: "Pharmacy & Medication Network — TalkRx",
  description:
    "Minimum-data-access dispensing portal, QR consent verification, dispensation logging, and prescribed-vs-dispensed discrepancy detection.",
};

export default function PharmacyNetworkPage() {
  return (
    <ModulePageShell moduleId="pharmacy-network">
      <PharmacyNetwork />
    </ModulePageShell>
  );
}
