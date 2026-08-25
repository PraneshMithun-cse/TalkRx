import "server-only";
import { groq, GROQ_TEXT_MODEL } from "@/lib/groq";

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

function average(values: number[], fallback: number): number {
  if (!values.length) return fallback;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

function clampConfidence(n: unknown): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0.5;
  return Math.min(1, Math.max(0, Math.round(v * 100) / 100));
}

const SELF_ASSESSMENT_SCHEMA = {
  type: "object",
  properties: {
    conditions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string", description: "Clinically normalized name of the symptom/condition/allergy" },
          kind: { type: "string", enum: ["symptom", "condition", "allergy"] },
          confidence: { type: "number", description: "0 to 1 confidence that this was actually reported" },
        },
        required: ["label", "kind", "confidence"],
        additionalProperties: false,
      },
    },
    medications: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rawText: { type: "string", description: "The exact phrase from the patient's text" },
          standardMolecule: { type: "string", description: "Standardized generic/molecule name, e.g. Metformin" },
          dosage: { type: "string" },
          frequency: { type: "string" },
          confidence: { type: "number" },
        },
        required: ["rawText", "standardMolecule", "dosage", "frequency", "confidence"],
        additionalProperties: false,
      },
    },
  },
  required: ["conditions", "medications"],
  additionalProperties: false,
} as const;

/**
 * Extracts structured symptoms/conditions/allergies/medications from a patient's free-text
 * self-assessment using Groq. Falls back to a single low-confidence "needs clinical review"
 * condition if the model call fails, mirroring the old rule-based engine's empty-result behavior.
 */
export async function extractFromSelfAssessment(rawText: string): Promise<SelfAssessmentExtractionResult> {
  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_TEXT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a clinical intake assistant for an Indian OPD kiosk. Extract symptoms, pre-existing " +
            "conditions, drug allergies, and current medications from the patient's own words. Be conservative: " +
            "only extract what is actually stated or clearly implied. Normalize medication molecule names to " +
            "their standard generic name (e.g. 'sugar tablet metformin' -> Metformin). If nothing clinically " +
            "relevant is present, return empty arrays.",
        },
        { role: "user", content: rawText },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "self_assessment_extraction", schema: SELF_ASSESSMENT_SCHEMA, strict: true },
      },
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty completion from Groq");
    const parsed = JSON.parse(raw) as {
      conditions: Array<{ label: string; kind: string; confidence: number }>;
      medications: Array<{ rawText: string; standardMolecule: string; dosage: string; frequency: string; confidence: number }>;
    };

    const conditions: ExtractedConditionResult[] = parsed.conditions.map((c) => ({
      label: c.label,
      kind: (["symptom", "condition", "allergy"] as const).includes(c.kind as "symptom" | "condition" | "allergy")
        ? (c.kind as "symptom" | "condition" | "allergy")
        : "condition",
      confidence: clampConfidence(c.confidence),
    }));

    const medications: ExtractedMedicationResult[] = parsed.medications.map((m) => ({
      rawText: m.rawText,
      standardMolecule: m.standardMolecule,
      dosage: m.dosage || "Unspecified",
      frequency: m.frequency || "As reported by patient",
      confidence: clampConfidence(m.confidence),
    }));

    if (conditions.length === 0 && medications.length === 0) {
      conditions.push({
        label: "General health concern noted — full clinical correlation recommended",
        kind: "condition",
        confidence: 0.4,
      });
    }

    const confidenceAvg = average([...conditions.map((c) => c.confidence), ...medications.map((m) => m.confidence)], 0.4);
    return { conditions, medications, confidenceAvg };
  } catch (err) {
    console.error("extractFromSelfAssessment: Groq call failed", err);
    return {
      conditions: [
        {
          label: "AI extraction unavailable — full clinical correlation recommended",
          kind: "condition",
          confidence: 0.3,
        },
      ],
      medications: [],
      confidenceAvg: 0.3,
    };
  }
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

const PHARMACY_BILL_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rawText: { type: "string" },
          standardMolecule: { type: "string" },
          dosage: { type: "string" },
          frequency: { type: "string", description: "e.g. OD, BD, TDS, QID, SOS, or 'Not specified on bill'" },
          quantity: { type: "string" },
          confidence: { type: "number" },
        },
        required: ["rawText", "standardMolecule", "dosage", "frequency", "quantity", "confidence"],
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
} as const;

/** Extracts structured line items from a pharmacy bill / dispensation text using Groq. */
export async function extractFromPharmacyBill(billText: string): Promise<PharmacyBillExtractionResult> {
  const lines = billText.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { items: [], confidenceAvg: 0 };

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_TEXT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a pharmacy bill parser for an Indian OPD pharmacy. Parse each line into a structured " +
            "medication entry: molecule/brand name, dosage (e.g. 500mg), frequency (OD/BD/TDS/QID/SOS or " +
            "'Not specified on bill'), and quantity (e.g. '10 tabs' or 'Not specified on bill'). Assign lower " +
            "confidence to lines that don't clearly look like a medication line.",
        },
        { role: "user", content: billText },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "pharmacy_bill_extraction", schema: PHARMACY_BILL_SCHEMA, strict: true },
      },
      temperature: 0.1,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty completion from Groq");
    const parsed = JSON.parse(raw) as { items: PharmacyBillLineResult[] };

    const items = parsed.items.map((i) => ({ ...i, confidence: clampConfidence(i.confidence) }));
    const confidenceAvg = average(items.map((i) => i.confidence), 0);
    return { items, confidenceAvg };
  } catch (err) {
    console.error("extractFromPharmacyBill: Groq call failed", err);
    const items = lines.map((line) => ({
      rawText: line,
      standardMolecule: line,
      dosage: "Unspecified",
      frequency: "Unspecified",
      quantity: "Unspecified",
      confidence: 0.3,
    }));
    return { items, confidenceAvg: 0.3 };
  }
}
