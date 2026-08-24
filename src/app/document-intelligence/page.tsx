import type { Metadata } from "next";
import { ModulePageShell } from "@/components/talkrx/ModulePageShell";
import { DocumentIntelligence } from "@/components/talkrx/DocumentIntelligence";

export const metadata: Metadata = {
  title: "Prescription Document AI — TalkRx",
  description:
    "Handwritten prescription and lab report OCR digitizer with confidence scoring and patient verification before it lands on the timeline.",
};

export default function DocumentIntelligencePage() {
  return (
    <ModulePageShell moduleId="document-intelligence">
      <DocumentIntelligence />
    </ModulePageShell>
  );
}
