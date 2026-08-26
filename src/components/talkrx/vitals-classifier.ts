import type { PatientVitals } from "./types";

export type BpFlag = "normal" | "elevated" | "stage1" | "stage2" | "crisis" | "unknown";
export type GlucoseFlag = "normal" | "prediabetic" | "diabetic" | "unknown";

export interface VitalsClassificationResult {
  /** Condition labels suitable for a diagnosis badge, e.g. "Hypertension (Stage 2)". */
  conditions: string[];
  /** A prose sentence (or empty string) to append to the HPI narrative. */
  narrative: string;
  bpFlag: BpFlag;
  glucoseFlag: GlucoseFlag;
}

function parseBloodPressure(bp?: string): { systolic: number; diastolic: number } | null {
  if (!bp) return null;
  const match = bp.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  if (!match) return null;
  return { systolic: Number(match[1]), diastolic: Number(match[2]) };
}

function parseGlucose(bg?: string): number | null {
  if (!bg) return null;
  const match = bg.match(/(\d{2,3}(?:\.\d+)?)/);
  if (!match) return null;
  return Number(match[1]);
}

/**
 * Classifies recorded vitals against standard clinical thresholds:
 * - Blood pressure: ACC/AHA staging (mmHg).
 * - Blood glucose: ADA diagnostic criteria (mg/dL), fasting vs. random/postprandial
 *   determined from the free-text `bloodGlucoseType` field.
 * Returns no classification for a metric that wasn't actually recorded — never
 * fabricates a diagnosis from a missing reading.
 */
export function classifyVitals(vitals?: PatientVitals): VitalsClassificationResult {
  const conditions: string[] = [];
  const narrativeParts: string[] = [];
  let bpFlag: BpFlag = "unknown";
  let glucoseFlag: GlucoseFlag = "unknown";

  const bp = parseBloodPressure(vitals?.bloodPressure);
  if (bp) {
    const { systolic, diastolic } = bp;
    if (systolic >= 180 || diastolic >= 120) {
      bpFlag = "crisis";
      conditions.push("Hypertensive Crisis");
      narrativeParts.push(
        `Blood pressure ${systolic}/${diastolic} mmHg indicates a hypertensive crisis requiring immediate clinical attention.`
      );
    } else if (systolic >= 140 || diastolic >= 90) {
      bpFlag = "stage2";
      conditions.push("Hypertension (Stage 2)");
      narrativeParts.push(`Blood pressure ${systolic}/${diastolic} mmHg is consistent with Stage 2 Hypertension.`);
    } else if (systolic >= 130 || diastolic >= 80) {
      bpFlag = "stage1";
      conditions.push("Hypertension (Stage 1)");
      narrativeParts.push(`Blood pressure ${systolic}/${diastolic} mmHg is consistent with Stage 1 Hypertension.`);
    } else if (systolic >= 120) {
      bpFlag = "elevated";
      conditions.push("Elevated Blood Pressure");
      narrativeParts.push(`Blood pressure ${systolic}/${diastolic} mmHg is in the elevated range.`);
    } else {
      bpFlag = "normal";
    }
  }

  const glucose = parseGlucose(vitals?.bloodGlucose);
  if (glucose !== null) {
    const isFasting = /fasting/i.test(vitals?.bloodGlucoseType ?? "");
    if (isFasting) {
      if (glucose >= 126) {
        glucoseFlag = "diabetic";
        conditions.push("Diabetes Mellitus (Fasting)");
        narrativeParts.push(`Fasting blood glucose ${glucose} mg/dL meets diagnostic criteria for Diabetes Mellitus.`);
      } else if (glucose >= 100) {
        glucoseFlag = "prediabetic";
        conditions.push("Prediabetes (Impaired Fasting Glucose)");
        narrativeParts.push(`Fasting blood glucose ${glucose} mg/dL indicates Prediabetes (Impaired Fasting Glucose).`);
      } else {
        glucoseFlag = "normal";
      }
    } else {
      if (glucose >= 200) {
        glucoseFlag = "diabetic";
        conditions.push("Diabetes Mellitus (Random/Postprandial)");
        narrativeParts.push(`Random/postprandial blood glucose ${glucose} mg/dL meets diagnostic criteria for Diabetes Mellitus.`);
      } else if (glucose >= 140) {
        glucoseFlag = "prediabetic";
        conditions.push("Prediabetes (Impaired Glucose Tolerance)");
        narrativeParts.push(`Post-meal blood glucose ${glucose} mg/dL indicates Prediabetes.`);
      } else {
        glucoseFlag = "normal";
      }
    }
  }

  return { conditions, narrative: narrativeParts.join(" "), bpFlag, glucoseFlag };
}
