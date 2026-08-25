"use server";

import { requireUser } from "@/lib/actions/auth-helpers";
import { extractFromSelfAssessment, extractFromPharmacyBill } from "@/lib/ai/extraction";
import type { SelfAssessmentExtractionResult, PharmacyBillExtractionResult } from "@/lib/ai/extraction";

export async function previewSelfAssessmentAction(rawText: string): Promise<SelfAssessmentExtractionResult> {
  return extractFromSelfAssessment(rawText);
}

export async function previewPharmacyBillAction(billText: string): Promise<PharmacyBillExtractionResult> {
  return extractFromPharmacyBill(billText);
}
