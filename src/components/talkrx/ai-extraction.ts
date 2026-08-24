const SYMPTOM_KEYWORDS: Record<string, string> = {
  headache: "Headache",
  "head ache": "Headache",
  fever: "Fever",
  cough: "Cough",
  cold: "Cold / Nasal Congestion",
  fatigue: "Fatigue",
  tired: "Fatigue",
  nausea: "Nausea",
  vomit: "Vomiting",
  dizziness: "Dizziness",
  dizzy: "Dizziness",
  "chest pain": "Chest Pain",
  breathless: "Breathlessness",
  "shortness of breath": "Breathlessness",
  "joint pain": "Joint Pain",
  "back pain": "Back Pain",
  "stomach pain": "Abdominal Pain",
  "abdominal pain": "Abdominal Pain",
  diarrhea: "Diarrhoea",
  constipation: "Constipation",
  rash: "Skin Rash",
  itching: "Itching",
  insomnia: "Sleep Disturbance",
  "sleep": "Sleep Disturbance",
  "sore throat": "Sore Throat",
  "burning": "Burning Sensation",
};

const CONDITION_KEYWORDS: Record<string, string> = {
  diabetes: "Diabetes Mellitus",
  diabetic: "Diabetes Mellitus",
  "blood pressure": "Hypertension",
  hypertension: "Hypertension",
  bp: "Hypertension",
  asthma: "Asthma",
  thyroid: "Thyroid Disorder",
  arthritis: "Arthritis",
  migraine: "Migraine",
  depression: "Depression",
  anxiety: "Anxiety Disorder",
  epilepsy: "Epilepsy",
  "kidney": "Renal Condition",
  "heart disease": "Cardiac Condition",
  cardiac: "Cardiac Condition",
};

const KNOWN_MOLECULES = [
  "metformin",
  "telmisartan",
  "amlodipine",
  "paracetamol",
  "ibuprofen",
  "omeprazole",
  "pantoprazole",
  "azithromycin",
  "amoxicillin",
  "cetirizine",
  "atorvastatin",
  "losartan",
  "glimepiride",
  "insulin",
  "aspirin",
  "levothyroxine",
  "salbutamol",
];

export interface ExtractedConditionResult {
  label: string;
  kind: "symptom" | "condition" | "allergy";
  confidence: number;
}

export interface ExtractedMedicationResult {
  rawText: string;
  standardMolecule: string;
  dosage: string;
  frequency: string;
  confidence: number;
}

export interface SelfAssessmentExtractionResult {
  conditions: ExtractedConditionResult[];
  medications: ExtractedMedicationResult[];
  confidenceAvg: number;
}

function randomInRange(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

export function extractFromSelfAssessment(rawText: string): SelfAssessmentExtractionResult {
  const text = rawText.toLowerCase();
  const conditions: ExtractedConditionResult[] = [];
  const seen = new Set<string>();

  for (const [kw, label] of Object.entries(SYMPTOM_KEYWORDS)) {
    if (text.includes(kw) && !seen.has(label)) {
      seen.add(label);
      conditions.push({ label, kind: "symptom", confidence: randomInRange(0.6, 0.9) });
    }
  }
  for (const [kw, label] of Object.entries(CONDITION_KEYWORDS)) {
    if (text.includes(kw) && !seen.has(label)) {
      seen.add(label);
      conditions.push({ label, kind: "condition", confidence: randomInRange(0.5, 0.7) });
    }
  }

  const allergyMatch = text.match(/allerg\w*\s+(to\s+)?([a-z0-9\- ]{2,30})/i);
  if (allergyMatch) {
    const allergen = allergyMatch[2].trim().replace(/\band\b.*$/i, "").trim();
    if (allergen && !seen.has(allergen)) {
      seen.add(allergen);
      conditions.push({ label: `Allergic to ${allergen}`, kind: "allergy", confidence: randomInRange(0.5, 0.6) });
    }
  }

  const medications: ExtractedMedicationResult[] = [];
  const dosageRegex = /([a-z]+)\s*(\d+\s?(mg|mcg|g|ml))/gi;
  let match: RegExpExecArray | null;
  while ((match = dosageRegex.exec(rawText)) !== null) {
    const word = match[1].toLowerCase();
    const known = KNOWN_MOLECULES.find((m) => m.startsWith(word) || word.startsWith(m));
    medications.push({
      rawText: match[0],
      standardMolecule: known ? known[0].toUpperCase() + known.slice(1) : match[1],
      dosage: match[2],
      frequency: "As reported by patient",
      confidence: randomInRange(known ? 0.7 : 0.5, known ? 0.85 : 0.65),
    });
  }

  if (conditions.length === 0 && medications.length === 0) {
    conditions.push({
      label: "General health concern noted — full clinical correlation recommended",
      kind: "condition",
      confidence: 0.4,
    });
  }

  const allConfidences = [...conditions.map((c) => c.confidence), ...medications.map((m) => m.confidence)];
  const confidenceAvg = allConfidences.length
    ? Math.round((allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length) * 100) / 100
    : 0.4;

  return { conditions, medications, confidenceAvg };
}

export interface PharmacyBillLineResult {
  rawText: string;
  standardMolecule: string;
  dosage: string;
  frequency: string;
  quantity: string;
  confidence: number;
}

export interface PharmacyBillExtractionResult {
  items: PharmacyBillLineResult[];
  confidenceAvg: number;
}

export function extractFromPharmacyBill(billText: string): PharmacyBillExtractionResult {
  const lines = billText.split("\n").map((l) => l.trim()).filter(Boolean);
  const items: PharmacyBillLineResult[] = [];
  const lineRegex =
    /([A-Za-z][\w-]{2,20})\s+(\d+\s?(?:mg|mcg|ml|g))\s*(OD|BD|TDS|QID|SOS)?\s*(?:x\s?(\d+\s?(?:days|tabs|tablets|caps)))?/i;

  for (const line of lines) {
    const m = line.match(lineRegex);
    if (m) {
      let confidence = 0.7;
      if (m[3]) confidence += 0.15;
      if (m[4]) confidence += 0.1;
      confidence = Math.min(confidence, 0.95);
      items.push({
        rawText: line,
        standardMolecule: m[1],
        dosage: m[2],
        frequency: m[3] || "Not specified on bill",
        quantity: m[4] || "Not specified on bill",
        confidence: Math.round(confidence * 100) / 100,
      });
    } else {
      items.push({
        rawText: line,
        standardMolecule: line,
        dosage: "Unspecified",
        frequency: "Unspecified",
        quantity: "Unspecified",
        confidence: 0.4,
      });
    }
  }

  const confidenceAvg = items.length
    ? Math.round((items.reduce((a, b) => a + b.confidence, 0) / items.length) * 100) / 100
    : 0;

  return { items, confidenceAvg };
}
