# TalkRx — AI-Powered Patient Case-Taking & Health Passport Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![ABDM](https://img.shields.io/badge/ABDM-FHIR%20R4%20Compliant-0d9488?style=flat-square)](https://abdm.gov.in/)

TalkRx converts dead queue waiting time in Indian outpatient departments (OPDs) into structured, multilingual clinical histories, 10-fold Dashavidha Pariksha, and consent-driven Health Passports before the consultation begins.

---

## The Clinical Challenge

In high-footfall primary healthcare settings, consultations frequently average under 2 to 3 minutes due to sheer patient volume. Because 70% to 80% of diagnostic clarity stems from an exhaustive clinical history, time-compressed inquiries increase the risk of missed red-flag symptoms and diagnostic delays.

**TalkRx flips the equation**: while patients wait in the OPD queue, an intelligent, multilingual speech and touch kiosk records an adaptive clinical intake, automatically categorizes symptoms under international (ICD-11 / SNOMED CT) and traditional (NAMASTE / AYUSH) taxonomies, and generates a structured 60-second summary for the consulting physician.

---

## Core Architecture & Features

```
                               ┌─────────────────────────────┐
                               │     Patient in OPD Queue    │
                               └──────────────┬──────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │  Multilingual Voice/    │                       │  ABHA Digital Health    │
        │  Touch Case-Taking      │                       │  Passport Vault         │
        └────────────┬────────────┘                       └────────────┬────────────┘
                     │                                                 │
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │ Adaptive Branching &    │                       │ OCR Medical Report      │
        │ Red-Flag Triage Engine  │                       │ Intelligence            │
        └────────────┬────────────┘                       └────────────┬────────────┘
                     │                                                 │
                     └────────────────────────┬────────────────────────┘
                                              ▼
                               ┌─────────────────────────────┐
                               │  Doctor Clinical Dashboard  │
                               │  (FHIR R4 / ICD-11 Summary) │
                               └─────────────────────────────┘
```

### 1. Multilingual Case-Taking Engine (`/case-taking`)
- **11+ Indic Languages**: Supports Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, and English.
- **Dual Clinical Streams**:
  - **Conventional Allopathy**: Onset, duration, severity, aggravating/relieving factors, medication history, and past interventions.
  - **AYUSH Dashavidha Pariksha**: 10-fold constitutional evaluation (Prakriti, Vikriti, Sara, Samhanana, Pramana, Satmya, Satwa, Ahara-shakti, Vyayama-shakti, Vaya).
- **Deterministic Red-Flag Triaging**: Instant clinical rule-checks for emergency conditions (e.g., Acute Coronary Syndrome, Red-Flag Headaches, Sepsis indicators) that dispatch immediate alerts to the triage desk.

### 2. Doctor Clinical Console (`/doctor-dashboard`)
- **60-Second Longitudinal Summary**: Highlights chief complaints, chronological HPI narrative, and key vitals.
- **Queue Management**: Real-time triage status, room allocation, and patient intake readiness.
- **Standardized Coding**: Direct integration of NAMASTE AYUSH codes, ICD-11 TM-2 codes, and SNOMED CT clinical terms.

### 3. Patient Health Passport (`/health-passport`)
- **ABHA & Tokenized Vault**: Instant digital health card with encrypted QR consent sharing.
- **Vision AI OCR Document Hub**: Upload and parse laboratory investigations, prescription slips, and discharge summaries into standardized telemetry points.
- **DPDP Act 2023 Compliance**: Granular, time-bound consent authorization and immutable access audit logs.

### 4. Enterprise Operations & Pharmacy Network
- **Hospital Triage Operations (`/triage-operations`)**: Department-wide bed tracking, acute queue monitoring, and triage escalation protocols.
- **Pharmacy & Fulfillment Network (`/pharmacy-network`)**: E-prescription routing, botanical/herbal formulary stock verification, and drug-interaction checks.

---

## Tech Stack

- **Framework**: [Next.js 16 (Turbopack / App Router)](https://nextjs.org/)
- **UI & State**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Data & Schemas**: TypeScript, FHIR R4 JSON schemas, ABHA consent data contracts
- **Security & Privacy**: Zero server-side persistence of raw unencrypted PHI, local vault state with consent tokens

---

## Getting Started

### Prerequisites
- Node.js 18.18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PraneshMithun-cse/TalkRx.git
cd TalkRx
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

To test and compile the production bundle:

```bash
npm run build
npm run start
```

---

## Project Structure

```
talkrx/
├── src/
│   ├── app/                          # Next.js App Router static & dynamic routes
│   │   ├── case-taking/              # Interactive clinical intake kiosk
│   │   ├── doctor-dashboard/         # Physician consultation console
│   │   ├── health-passport/          # Citizen ABHA health card & records vault
│   │   ├── triage-operations/        # OPD queue telemetry & department triage
│   │   ├── pharmacy-network/         # Prescription & AYUSH formulary routing
│   │   └── document-intelligence/    # Neural OCR & clinical document analysis
│   ├── components/
│   │   ├── talkrx/                   # Core clinical engine modules & vault context
│   │   └── sites/                    # Modern responsive design system & layouts
│   └── data/                         # Clinical terminology & taxonomy dictionaries
├── public/                           # Optimized icons, telemetry assets, and images
├── next.config.ts                    # Next.js compiler & bundle configuration
└── tsconfig.json                     # Strict TypeScript configuration
```

---

## License

MIT License. Designed and developed for next-generation clinical workflows.
