const ASSET_BASE = "/sites/demophorius-com-d11dd431/root-8a5edab2";

export interface RootCategory {
  brand: string;
  tag: string;
  href: string;
  imageSrc: string;
  dotColor: string;
  logoSrc?: string;
  totalCount: string;
  subcategories: { name: string; count: string | number; href: string }[];
}

export const ROOT_CATEGORIES: RootCategory[] = [
  {
    brand: "TalkRx Kiosk & Intake",
    tag: "01 · MULTIMODAL INTAKE",
    href: "#engine",
    imageSrc: "/images/modules/kiosk_ai.jpg",
    dotColor: "#3b82f6",
    totalCount: "11+ Langs",
    subcategories: [
      { name: "Indic ASR (11 Languages + Code-Mixed)", count: "Real-Time", href: "#engine" },
      { name: "Non-Literate Touch Body-Map", count: "Visual", href: "#engine" },
      { name: "Adaptive Clinical Question Graph", count: "Branching", href: "#engine" },
      { name: "Negation & Completeness Detector", count: "Guaranteed", href: "#engine" },
    ],
  },
  {
    brand: "AYUSH & Dashavidha",
    tag: "02 · AYURVEDA & NAMASTE",
    href: "#ayush",
    imageSrc: "/images/modules/ayush_ai.jpg",
    dotColor: "#10b981",
    totalCount: "10 Pillars",
    subcategories: [
      { name: "Prakriti & Vikriti Assessment", count: "Validated", href: "#ayush" },
      { name: "Sara, Samhanana & Pramana", count: "Tenfold", href: "#ayush" },
      { name: "Agni, Koshtha & Bowel Elicitation", count: "Clinical", href: "#ayush" },
      { name: "NAMASTE & WHO ICD-11 TM-2 Codes", count: "Standard", href: "#ayush" },
    ],
  },
  {
    brand: "Medical Document AI",
    tag: "03 · PRESCRIPTION OCR",
    href: "#document-ai",
    imageSrc: "/images/modules/document_ocr_ai.jpg",
    dotColor: "#f59e0b",
    totalCount: "4 Pipelines",
    subcategories: [
      { name: "Handwritten Prescription OCR & Vision", count: "99% Conf", href: "#document-ai" },
      { name: "Drug & Molecule Normalisation", count: "Formulary", href: "#document-ai" },
      { name: "Lab Parameter Range Parsing", count: "Automated", href: "#document-ai" },
      { name: "Plain-Language Patient Confirmation", count: "Verified", href: "#document-ai" },
    ],
  },
  {
    brand: "Physician Triage Desk",
    tag: "04 · CLINICAL SUMMARY",
    href: "#triage",
    imageSrc: "/images/modules/physician_triage_ai.jpg",
    dotColor: "#ef4444",
    totalCount: "<60s Review",
    subcategories: [
      { name: "60-Second Formatted HPI Summary", count: "Prose", href: "#triage" },
      { name: "Deterministic Red-Flag Emergency Alert", count: "Zero False -ve", href: "#triage" },
      { name: "Visual Medication & Allergy Timeline", count: "Highlighted", href: "#triage" },
      { name: "FHIR R4 Bundle & HIS Webhooks", count: "REST API", href: "#triage" },
    ],
  },
  {
    brand: "Health Passport & Pharmacy",
    tag: "05 · CONSENT ECOSYSTEM",
    href: "#passport",
    imageSrc: "/images/modules/kiosk_ai.jpg",
    dotColor: "#8b5cf6",
    totalCount: "3-Sided Loop",
    subcategories: [
      { name: "ABDM ABHA Identity & Consent Ledger", count: "Revocable", href: "#passport" },
      { name: "Write-Only Pharmacy Dispensation QR", count: "Closed-Loop", href: "#passport" },
      { name: "Returning Patient 90-Sec Fast Pre-fill", count: "75% Faster", href: "#passport" },
      { name: "Print & QR Fallback for Legacy OPDs", count: "Zero Barrier", href: "#passport" },
    ],
  },
];
