"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Stethoscope, User, ShieldCheck, Pill, Building2 } from "lucide-react";
import { getOnboardingStatusAction, completePatientOnboardingAction, completeStaffOnboardingAction } from "@/lib/actions/onboarding";
import { INDIC_LANGUAGES } from "@/components/talkrx/mock-data";
import type { IndicLanguage } from "@/components/talkrx/types";

const ROLE_LANDING: Record<string, string> = {
  PATIENT: "/health-passport",
  DOCTOR: "/doctor-dashboard",
  PHARMACY: "/pharmacy-network",
  STAFF: "/triage-operations",
};

type Step = "loading" | "choose" | "patient" | "staff";

export default function OnboardingPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<Step>("loading");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }
    (async () => {
      const status = await getOnboardingStatusAction();
      if (status.onboarded && status.role) {
        router.replace(ROLE_LANDING[status.role] ?? "/");
        return;
      }
      setStep("choose");
    })();
  }, [isLoaded, isSignedIn, router]);

  if (step === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">Loading your TalkRx profile…</div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Welcome to TalkRx</h1>
          <p className="mt-2 text-sm text-neutral-500">One more step — tell us who you are so we can set up your account.</p>
        </div>

        {step === "choose" && <RoleChoice onPickPatient={() => setStep("patient")} onPickStaff={() => setStep("staff")} />}
        {step === "patient" && <PatientForm onBack={() => setStep("choose")} />}
        {step === "staff" && <StaffForm onBack={() => setStep("choose")} />}
      </div>
    </div>
  );
}

function RoleChoice({ onPickPatient, onPickStaff }: { onPickPatient: () => void; onPickStaff: () => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        type="button"
        onClick={onPickPatient}
        className="rounded-[28px] border border-black/[0.08] bg-white p-8 text-left shadow-sm hover:shadow-md hover:border-black/20 transition-all space-y-3"
      >
        <User className="h-6 w-6 text-neutral-900" />
        <div className="text-lg font-bold text-neutral-950">I&apos;m a Patient</div>
        <p className="text-xs text-neutral-500">Get your TalkRx Health Passport, serial number, and access to case-taking.</p>
      </button>
      <button
        type="button"
        onClick={onPickStaff}
        className="rounded-[28px] border border-black/[0.08] bg-white p-8 text-left shadow-sm hover:shadow-md hover:border-black/20 transition-all space-y-3"
      >
        <Stethoscope className="h-6 w-6 text-neutral-900" />
        <div className="text-lg font-bold text-neutral-950">I&apos;m Clinical Staff</div>
        <p className="text-xs text-neutral-500">Doctor, pharmacy, or hospital triage — access the clinical dashboards.</p>
      </button>
    </div>
  );
}

function PatientForm({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Female" | "Male" | "Other">("Female");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [preferredLanguage, setPreferredLanguage] = useState<IndicLanguage>("en");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age) return;
    setIsSubmitting(true);
    try {
      await completePatientOnboardingAction({ name: name.trim(), age: Number(age), gender, phone, bloodGroup, preferredLanguage });
      router.replace("/health-passport");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-black/[0.08] bg-white p-6 space-y-4 shadow-sm text-xs">
      <button type="button" onClick={onBack} className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-700">
        &larr; Back
      </button>
      <div>
        <label className="font-semibold text-neutral-600 block mb-1">Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Iyer" required className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-neutral-600 block mb-1">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="42" required min={0} max={120} className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
        </div>
        <div>
          <label className="font-semibold text-neutral-600 block mb-1">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as typeof gender)} className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900">
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-neutral-600 block mb-1">Blood Group</label>
          <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900">
            {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((bg) => (
              <option key={bg}>{bg}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold text-neutral-600 block mb-1">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98402 12345" className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
        </div>
      </div>
      <div>
        <label className="font-semibold text-neutral-600 block mb-1">Preferred Language</label>
        <select
          value={preferredLanguage}
          onChange={(e) => setPreferredLanguage(e.target.value as IndicLanguage)}
          className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900"
        >
          {INDIC_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name} ({l.nativeName})
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-neutral-950 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm mt-2 disabled:opacity-50"
      >
        {isSubmitting ? "Creating…" : "Generate Digital Passport"}
      </button>
    </form>
  );
}

const STAFF_ROLES = [
  { value: "DOCTOR" as const, label: "Doctor", icon: Stethoscope },
  { value: "PHARMACY" as const, label: "Pharmacy", icon: Pill },
  { value: "STAFF" as const, label: "Hospital / Triage Staff", icon: Building2 },
];

function StaffForm({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [role, setRole] = useState<"DOCTOR" | "PHARMACY" | "STAFF">("DOCTOR");
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await completeStaffOnboardingAction({ role, name: name.trim(), licenseNumber, organization, department });
      router.replace(ROLE_LANDING[role]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-black/[0.08] bg-white p-6 space-y-4 shadow-sm text-xs">
      <button type="button" onClick={onBack} className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-700">
        &larr; Back
      </button>

      <div>
        <label className="font-semibold text-neutral-600 block mb-2">Role</label>
        <div className="grid grid-cols-3 gap-2">
          {STAFF_ROLES.map((r) => {
            const Icon = r.icon;
            const active = role === r.value;
            return (
              <button
                type="button"
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-colors ${
                  active ? "border-neutral-950 bg-neutral-950 text-white" : "border-black/10 bg-neutral-50 text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="font-semibold text-neutral-600 block mb-1">Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Anjali Rao" required className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-neutral-600 block mb-1">License Number</label>
          <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="e.g. TN-MED-88213" className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
        </div>
        <div>
          <label className="font-semibold text-neutral-600 block mb-1">Department</label>
          <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. General Medicine" className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
        </div>
      </div>
      <div>
        <label className="font-semibold text-neutral-600 block mb-1">Organization / Facility</label>
        <input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="e.g. Apollo Hospitals, Chennai" className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-800 flex items-start gap-2">
        <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>Self-declared for this demo deployment — a production rollout would gate clinical roles behind admin approval / license verification.</span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-neutral-950 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm mt-2 disabled:opacity-50"
      >
        {isSubmitting ? "Setting up…" : "Enter Clinical Console"}
      </button>
    </form>
  );
}
