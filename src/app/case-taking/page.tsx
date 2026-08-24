import type { Metadata } from "next";
import { CaseTakingEngine } from "@/components/talkrx/CaseTakingEngine";

export const metadata: Metadata = {
  title: "AI Case-Taking Engine — TalkRx",
  description:
    "Dual-mode voice and touch intake with 11+ Indic languages, adaptive branching, real-time red-flag detection, and a 60-second physician-ready HPI.",
};

export default function CaseTakingPage() {
  return <CaseTakingEngine />;
}
