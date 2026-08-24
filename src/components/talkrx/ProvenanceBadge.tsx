import type { ProvenanceSource } from "./types";

const SOURCE_LABEL: Record<ProvenanceSource, string> = {
  "patient-reported": "Patient-Reported",
  "doctor-prescribed": "Doctor-Verified",
  "pharmacy-dispensed": "Pharmacy-Dispensed",
  "document-extracted": "Document-Extracted",
  "ayush-assessed": "AYUSH-Assessed",
  "lab-verified": "Lab-Verified",
};

export function ProvenanceBadge({
  source,
  confidence,
  verified,
}: {
  source: ProvenanceSource;
  confidence?: number;
  verified?: boolean;
}) {
  const isVerified = verified === true || source === "doctor-prescribed" || source === "lab-verified";
  const isUnverifiedPatient = source === "patient-reported" && !verified;

  const cls = isVerified
    ? "bg-neutral-900 text-white"
    : isUnverifiedPatient
    ? "border border-amber-500/30 bg-amber-500/[0.08] text-amber-800"
    : "bg-neutral-100 text-neutral-700";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${cls}`}
      style={{ fontFamily: "var(--do-font-label)" }}
    >
      {SOURCE_LABEL[source]}
      {typeof confidence === "number" && !isVerified && <span className="font-normal normal-case">&bull; {Math.round(confidence * 100)}% AI</span>}
    </span>
  );
}
