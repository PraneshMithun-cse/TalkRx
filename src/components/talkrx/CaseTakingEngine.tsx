"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mic,
  Send,
  Leaf,
  Globe,
  User,
  Menu,
  CheckCircle2,
  ShieldAlert,
  RefreshCw,
  ArrowRight,
  Upload,
  FileText,
} from "lucide-react";
import { INDIC_LANGUAGES } from "./mock-data";
import { useVault } from "./VaultContext";
import { formatSerial } from "./serial";
import type { IndicLanguage, RedFlagAlert, StructuredHpiSummary, DashavidhaParikshaData } from "./types";

type Mode = "conventional" | "ayush";

interface QuestionStep {
  id: string;
  category: string;
  stepIndex: number;
  totalSteps: number;
  question: string;
  indicPrompt: Record<IndicLanguage, string>;
  suggestions: string[];
  ayushCategory?: string;
  ayushQuestion?: string;
  ayushSuggestions?: string[];
}

const CONVENTIONAL_STEPS = [
  "PRESENTING COMPLAINT",
  "HISTORY OF PRESENT ILLNESS",
  "MEDICAL HISTORY",
  "MEDICATIONS",
  "ALLERGIES",
  "REVIEW OF SYSTEMS",
];

const AYUSH_STEPS = [
  "PRAKRITI (CONSTITUTION)",
  "VIKRITI (PATHOLOGY)",
  "AGNI & KOSHTHA",
  "SARA & SAMHANANA",
  "AHARA & VYAYAMA",
  "ASHTAVIDHA PARIKSHA",
];

const QUESTIONS: QuestionStep[] = [
  {
    id: "q1",
    category: "PRESENTING COMPLAINT",
    stepIndex: 1,
    totalSteps: 11,
    question: "What brings you in today?",
    indicPrompt: {
      en: "What brings you in today?",
      ta: "இன்று உங்களுக்கு என்ன பிரச்சனை அல்லது வலி உள்ளது?",
      hi: "आज आप किस परेशानी या दर्द के लिए आए हैं?",
      te: "ఈరోజు మీకు ఏ సమస్య లేదా నొప్పి ఉంది?",
      bn: "আজ আপনার কী সমস্যা বা অসুস্থতা হচ্ছে?",
      mr: "आज तुम्हाला काय त्रास होत आहे?",
      kn: "ಇಂದು ನಿಮಗೆ ಯಾವ ಸಮಸ್ಯೆ ಅಥವಾ ನೋವು ಇದೆ?",
      ml: "ഇന്ന് നിങ്ങൾക്ക് എന്താണ് അസ്വസ്ഥത അല്ലെങ്കിൽ വേദന?",
      gu: "આજે તમને શું તકલીફ અથવા દુખાવો છે?",
      pa: "ਅੱਜ ਤੁਹਾਨੂੰ ਕਿਸ ਤਰ੍ਹਾਂ ਦੀ ਤਕਲੀਫ ਹੈ?",
      od: "ଆଜି ଆପଣଙ୍କୁ କଣ ଅସୁବିଧା ହେଉଛି?",
    },
    suggestions: [
      "Chest Tightness & Heaviness",
      "Stomach Burning / Severe Acidity",
      "Bilateral Knee Joint Pain",
      "High Fever with Body Chills",
      "Chronic Fatigue & Weakness",
    ],
    ayushCategory: "PRAKRITI (CONSTITUTION)",
    ayushQuestion: "What is your primary constitutional complaint or body imbalance?",
    ayushSuggestions: [
      "Amlapitta (Acid burning in chest & throat)",
      "Sandhivata (Joint pain with morning crepitus)",
      "Vishamagni (Irregular digestion & gas)",
      "Shwasa (Breathlessness & cough)",
    ],
  },
  {
    id: "q2",
    category: "HISTORY OF PRESENT ILLNESS",
    stepIndex: 2,
    totalSteps: 11,
    question: "When did the discomfort start, and does it spread anywhere?",
    indicPrompt: {
      en: "When did the discomfort start, and does it spread to your arm or back?",
      ta: "வலி எப்போது தொடங்கியது? கை அல்லது முதுகுக்கு பரவுகிறதா?",
      hi: "दर्द कब शुरू हुआ? क्या यह हाथ या पीठ की तरफ फैल रहा है?",
      te: "నొప్పి ఎప్పుడు మొదలైంది? చేయి లేదా వెనుకకు పాకుతుందా?",
      bn: "ব্যথা কখন শুরু হয়েছে? হাতে বা পিঠে ছড়াচ্ছে?",
      mr: "त्रास कधी सुरू झाला? डाव्या हाताला कळ लागतेय का?",
      kn: "ನೋವು ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು?",
      ml: "വേദന എപ്പോഴാണ് തുടങ്ങിയത്?",
      gu: "દુખાવો ક્યારે શરૂ થયો?",
      pa: "ਦਰਦ ਕਦੋਂ ਸ਼ੁਰੂ ਹੋਇਆ?",
      od: "ଯନ୍ତ୍ରଣା କେବେ ଆରମ୍ଭ ହେଲା?",
    },
    suggestions: [
      "45 minutes ago, radiating to left arm & cold sweats",
      "Past 3 weeks, worsens after meals",
      "Chronic 6 months, severe morning stiffness",
      "Since yesterday evening with sudden onset",
    ],
    ayushCategory: "VIKRITI (PATHOLOGY)",
    ayushQuestion: "Does the pain increase with cold weather, spicy food, or exertion?",
    ayushSuggestions: [
      "Aggravated by pungent/sour foods (Pitta Vikriti)",
      "Aggravated by cold & exertion (Vata Vikriti)",
      "Heaviness after heavy sweet meals (Kapha Vikriti)",
    ],
  },
  {
    id: "q3",
    category: "MEDICAL HISTORY",
    stepIndex: 3,
    totalSteps: 11,
    question: "Do you have any existing chronic conditions like Diabetes or BP?",
    indicPrompt: {
      en: "Do you have Diabetes, Blood Pressure, Thyroid, or prior surgeries?",
      ta: "சர்க்கரை நோய், ரத்த அழுத்தம் அல்லது தைராய்டு உள்ளதா?",
      hi: "क्या आपको शुगर, बीपी, थायरॉइड या दिल की पुरानी बीमारी है?",
      te: "షుగర్, బీపీ లేదా థైరాయిడ్ సమస్యలు ఏమైనా ఉన్నాయా?",
      bn: "সুগার, প্রেসার বা থাইরয়েডের কোনো সমস্যা আছে?",
      mr: "मधुमेह, रक्तदाब किंवा इतर जुनाट आजार आहेत का?",
      kn: "ಸಕ್ಕರೆ ಕಾಯಿಲೆ ಅಥವಾ ರಕ್ತದೊತ್ತಡ ಇದೆಯೇ?",
      ml: "പ്രമേഹം, പ്രഷർ എന്നിവ ഉണ്ടോ?",
      gu: "ડાયાબિટીસ અથવા બીપીની તકલીફ છે?",
      pa: "ਸ਼ੂਗਰ ਜਾਂ ਬੀਪੀ ਦੀ ਸਮੱਸਿਆ ਹੈ?",
      od: "ଡାଇବେଟିସ କିମ୍ବା ବିପି ଅଛି କି?",
    },
    suggestions: [
      "Type-2 Diabetes (12 Years) + Hypertension",
      "Hypertension only (on daily medication)",
      "Asthma / Respiratory allergy",
      "No known chronic illness",
    ],
    ayushCategory: "AGNI & KOSHTHA",
    ayushQuestion: "How is your digestive fire (Agni) and bowel regularity (Koshtha)?",
    ayushSuggestions: [
      "Tikshnagni (Intense hunger, acid reflux, soft bowel)",
      "Mandagni (Sluggish digestion, heaviness, constipation)",
      "Vishamagni (Irregular appetite with gas/bloating)",
      "Samagni (Balanced digestion and regular evacuation)",
    ],
  },
  {
    id: "q4",
    category: "MEDICATIONS",
    stepIndex: 4,
    totalSteps: 11,
    question: "What medicines are you currently taking?",
    indicPrompt: {
      en: "What tablets or injections do you currently take daily?",
      ta: "தற்போது தினமும் என்ன மாத்திரைகள் சாப்பிடுகிறீர்கள்?",
      hi: "वर्तमान में आप कौन सी दवाइयाँ या गोलियाँ ले रहे हैं?",
      te: "ప్రస్తుతం రోజూ ఏ మందులు వాడుతున్నారు?",
      bn: "বর্তমানে আপনি কী কী ওষুধ খাচ্ছেন?",
      mr: "सध्या तुम्ही कोणती औषधे रोज घेत आहात?",
      kn: "ಪ್ರಸ್ತುತ ಯಾವ ಮಾತ್ರೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಿ?",
      ml: "നിലവിൽ എന്തെല്ലാം മരുന്നുകളാണ് കഴിക്കുന്നത്?",
      gu: "હાલમાં તમે કઈ દવાઓ લો છો?",
      pa: "ਕਿਹੜੀਆਂ ਦਵਾਈਆਂ ਲੈ ਰਹੇ ਹੋ?",
      od: "ବର୍ତ୍ତମାନ କେଉଁ ଔଷଧ ଖାଉଛନ୍ତି?",
    },
    suggestions: [
      "Tab. Metformin 500mg BD + Telmisartan 40mg",
      "Took an Antacid at home with zero relief",
      "Ayurvedic herbal decoction (Kashayam)",
      "Not taking any regular medications",
    ],
    ayushCategory: "SARA & SAMHANANA",
    ayushQuestion: "How would you describe your physical build, strength, and tissue vitality?",
    ayushSuggestions: [
      "Pravara Sara (Strong vitality, good stamina, well-built)",
      "Madhyama Sara (Moderate build and endurance)",
      "Avara Sara (Slender, fatigues easily, low physical strength)",
    ],
  },
  {
    id: "q5",
    category: "ALLERGIES",
    stepIndex: 5,
    totalSteps: 11,
    question: "Do you have any known allergies to medicines or foods?",
    indicPrompt: {
      en: "Are you allergic to any medicines like Sulfa drugs, Penicillin, or foods?",
      ta: "ஏதேனும் மாத்திரை அல்லது உணவுக்கு அலர்ஜி உள்ளதா?",
      hi: "क्या आपको किसी दवा या खाने से कोई एलर्जी है?",
      te: "ఏదైనా మందు లేదా ఆహారానికి ఎలర్జీ ఉందా?",
      bn: "কোনো ওষুধ বা খাবারে অ্যালার্জি আছে?",
      mr: "कोणत्याही औषधाची किंवा अन्नाची ॲलर्जी आहे का?",
      kn: "ಯಾವುದಾದರೂ ಔಷಧಿಗೆ ಅಲರ್ಜಿ ಇದೆಯೇ?",
      ml: "മരുന്നുകളോട് അലർജി ഉണ്ടോ?",
      gu: "કોઈ દવાની એલર્જી છે?",
      pa: "ਕਿਸੇ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ?",
      od: "କୌଣସି ଔଷଧରୁ ଆଲର୍ଜି ଅଛି କି?",
    },
    suggestions: [
      "Sulfa drugs (Causes severe lip swelling / angioedema)",
      "Penicillin / Amoxicillin allergy (Skin rashes)",
      "NSAIDs / Aspirin (Gastric pain)",
      "No known allergies",
    ],
    ayushCategory: "AHARA & VYAYAMA",
    ayushQuestion: "What are your dietary preferences and daily exercise capacity?",
    ayushSuggestions: [
      "Predominantly spicy, salty, pungent food (Pitta-aggravating)",
      "Irregular meal timings with dry, light food (Vata-aggravating)",
      "Heavy, sweet, oily food with sedentary lifestyle (Kapha-aggravating)",
      "Balanced vegetarian diet with moderate daily walking",
    ],
  },
  {
    id: "q6",
    category: "REVIEW OF SYSTEMS",
    stepIndex: 6,
    totalSteps: 11,
    question: "Any other symptoms like dizziness, breathlessness, or sweating?",
    indicPrompt: {
      en: "Any other associated symptoms like cold sweating or breathing trouble?",
      ta: "மயக்கம், மூச்சுத்திணறல் அல்லது அதிக வேர்வை உள்ளதா?",
      hi: "क्या चक्कर, सांस फूलना या ठंडा पसीना आ रहा है?",
      te: "తలతిరగడం, ఆయాసం లేదా చెమటలు పడుతున్నాయా?",
      bn: "মাথা ঘোরা, শ্বাসকষ্ট বা বেশি ঘাম হচ্ছে?",
      mr: "चक्कर येणे, धाप लागणे किंवा घाम येतोय का?",
      kn: "ತಲೆಸುತ್ತು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಇದೆಯೇ?",
      ml: "തലകറക്കം അല്ലെങ്കിൽ ശ്വാസംമുട്ടൽ ഉണ്ടോ?",
      gu: "ચક્કર અથવા શ્વાસ લેવામાં તકલીફ થાય છે?",
      pa: "ਚੱਕਰ ਆਉਣਾ ਜਾਂ ਸਾਹ ਚੜ੍ਹਨਾ?",
      od: "ମୁଣ୍ଡ ବୁଲାଇବା କିମ୍ବା ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି କି?",
    },
    suggestions: [
      "Severe cold sweats and resting breathlessness",
      "Nocturnal burning feet and insomnia",
      "Mild nausea without vomiting",
      "None of the above",
    ],
    ayushCategory: "ASHTAVIDHA PARIKSHA",
    ayushQuestion: "Review of eightfold traditional clinical indicators (Ashtavidha):",
    ayushSuggestions: [
      "Nadi (Pulse): Manduka Gati / Pitta-Vata bounding",
      "Jihva (Tongue): Saama (White coated with hyperacidity)",
      "Mutra & Mala: Peeta Varna (Yellowish urine, soft stools)",
      "Sparsha: Ushna (Warm skin temperature)",
    ],
  },
];

export function CaseTakingEngine({
  onComplete,
  onTriggerRedFlag,
}: {
  onComplete?: (summary: StructuredHpiSummary) => void;
  onTriggerRedFlag?: (alert: RedFlagAlert) => void;
}) {
  const router = useRouter();
  const { currentPatient, isHydrated, submitCaseTakingSummary } = useVault();
  const [mode, setMode] = useState<Mode>("conventional");
  const [selectedLang, setSelectedLang] = useState<IndicLanguage>("ta");
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasRedFlag, setHasRedFlag] = useState(false);
  const [redFlagAlert, setRedFlagAlert] = useState<RedFlagAlert | null>(null);
  const [answers, setAnswers] = useState<{ category: string; question: string; answer: string }[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlagAlert[]>([]);
  const [startedAt] = useState(() => Date.now());

  const activeQuestion = QUESTIONS[currentQIndex] || QUESTIONS[0];
  const stepsList = mode === "conventional" ? CONVENTIONAL_STEPS : AYUSH_STEPS;
  const currentStepName = mode === "conventional" ? activeQuestion.category : (activeQuestion.ayushCategory || activeQuestion.category);
  const currentQuestionText = mode === "conventional" ? activeQuestion.question : (activeQuestion.ayushQuestion || activeQuestion.question);
  const currentSuggestions = mode === "conventional" ? activeQuestion.suggestions : (activeQuestion.ayushSuggestions || activeQuestion.suggestions);

  const patientTag = currentPatient
    ? `PATIENT: ${currentPatient.name.toUpperCase()} • ${
        currentPatient.abhaId !== "Not Linked" ? currentPatient.abhaId : `SERIAL ${formatSerial(currentPatient.serialNumber)}`
      }`
    : "NO PATIENT SESSION ACTIVE";

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    let triggeredAlert: RedFlagAlert | null = null;

    // Check for Red Flag trigger on cardiac terms
    if (
      text.toLowerCase().includes("chest") ||
      text.toLowerCase().includes("arm") ||
      text.toLowerCase().includes("sweat") ||
      text.toLowerCase().includes("crushing")
    ) {
      triggeredAlert = {
        // eslint-disable-next-line react-hooks/purity -- runs only inside this user-triggered submit handler, never during render.
        id: `rf-${Date.now()}`,
        category: "cardiac",
        severity: "critical",
        matchedRule: "RULE_ACS_01: Retrosternal chest pressure + left arm radiation + diaphoresis",
        patientStatement: text,
        timestamp: new Date().toLocaleTimeString(),
        escalatedTo: "Emergency Triage Bed #1 & Duty Medical Officer",
        status: "active",
        actionRequired: "Stat 12-lead ECG, Oxygen 4L/min, IV Cannulation, immediate bedside review.",
      };
      setHasRedFlag(true);
      setRedFlagAlert(triggeredAlert);
      setRedFlags((prev) => [...prev, triggeredAlert as RedFlagAlert]);
      if (onTriggerRedFlag) onTriggerRedFlag(triggeredAlert);
    }

    const answerRecord = { category: currentStepName, question: currentQuestionText, answer: text };
    const updatedAnswers = [...answers, answerRecord];
    setAnswers(updatedAnswers);
    setInputValue("");

    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      return;
    }

    setIsComplete(true);

    const finalRedFlags = triggeredAlert ? [...redFlags, triggeredAlert] : redFlags;
    const chiefComplaint = updatedAnswers[0]?.answer || "Not specified";
    const hpiNarrative = updatedAnswers.map((a) => `${a.category}: ${a.answer}`).join(" — ");

    const summary: StructuredHpiSummary = {
      chiefComplaint,
      duration: updatedAnswers[1]?.answer || "Not specified",
      hpiNarrative,
      pertinentPositives: updatedAnswers.slice(0, 4).map((a) => a.answer),
      pertinentNegatives: [],
      redFlagsDetected: finalRedFlags,
      allergies: [],
      currentMedications: [],
      pastMedicalHistory: [updatedAnswers[2]?.answer || "Not specified"],
      pastSurgicalHistory: [],
      familyHistory: [],
      lifestyle: { smoking: "Not captured", alcohol: "Not captured", diet: "Not captured", sleep: "Not captured" },
      reviewOfSystems: Object.fromEntries(updatedAnswers.map((a) => [a.category, a.answer])),
      generatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      // eslint-disable-next-line react-hooks/purity -- Date.now() here only ever runs inside this user-triggered submit handler, never during render.
      intakeDurationSeconds: Math.round((Date.now() - startedAt) / 1000),
    };

    const ayushData: DashavidhaParikshaData | undefined =
      mode === "ayush"
        ? {
            prakriti: {
              primaryDosha: updatedAnswers[0]?.answer || "Tridosha",
              scores: { vata: 0, pitta: 0, kapha: 0 },
              physicalTraits: "Pending clinical scoring by AYUSH practitioner",
              psychologicalTraits: "Pending clinical scoring by AYUSH practitioner",
            },
            vikriti: {
              imbalancedDosha: updatedAnswers[1]?.answer || "Not assessed",
              currentDeviation: updatedAnswers[1]?.answer || "Not assessed",
              namasteMorbidityCode: "",
              whoIcd11Tm2Code: "",
            },
            sara: { tissueQuality: updatedAnswers[3]?.answer || "Madhyama (Medium)", dominantTissue: "Not assessed" },
            samhanana: { build: "Moderate" },
            pramana: { anthropometry: "Proportionate" },
            satmya: { habituation: "Mixed" },
            sattva: { mentalStrength: "Madhyama (Moderate)" },
            aharaShakti: { abhyavaharana: "Moderate", jaranaShakti: "Good Digestion" },
            vyayamaShakti: { exerciseCapacity: "Moderate" },
            vaya: { ageClassification: "Madhyama (Middle age)" },
            ashtavidha: {
              nadi: updatedAnswers[5]?.answer || "Not assessed",
              mutra: "Not assessed",
              mala: "Not assessed",
              jihva: "Not assessed",
              shabda: "Not assessed",
              sparsha: "Not assessed",
              drik: "Not assessed",
              akriti: "Not assessed",
            },
            agni: "Samagni (Balanced)",
            koshtha: "Madhyama (Medium)",
          }
        : undefined;

    if (currentPatient) {
      setIsSaving(true);
      try {
        await submitCaseTakingSummary(currentPatient.id, summary, ayushData);
      } finally {
        setIsSaving(false);
      }
    }

    if (onComplete) onComplete(summary);
  };

  const handleMicToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const sampleSpoken = activeQuestion.indicPrompt[selectedLang] || activeQuestion.indicPrompt.en;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < sampleSpoken.length) {
        setInputValue((prev) => prev + sampleSpoken.charAt(idx));
        idx++;
      } else {
        clearInterval(interval);
        setIsListening(false);
      }
    }, 35);
  };

  if (isHydrated && !currentPatient) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[#fafafa] px-6 text-center">
        <h2 className="text-2xl font-bold text-neutral-950">No Patient Session Active</h2>
        <p className="max-w-md text-sm text-neutral-600">
          The AI case-taking kiosk records a clinical history against a patient account. Sign in with a patient account, or
          create a TalkRx Health Passport, to begin.
        </p>
        <Link
          href="/health-passport"
          className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
        >
          Go to Health Passport
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fafafa] flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Precision Geometric Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Soft Ambient Depth Glows */}
      <div
        className="pointer-events-none absolute -top-24 -left-20 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #fed7aa 0%, #ffedd5 45%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 h-[500px] w-[500px] rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, #fed7aa 0%, #fff7ed 50%, transparent 75%)" }}
      />

      {/* Top Application Header Bar */}
      <header className="relative z-20 flex items-center justify-between border-b border-black/[0.08] bg-white/90 px-6 py-4 backdrop-blur-xl md:px-10">
        {/* Left Wordmark */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-baseline gap-1.5 font-bold tracking-tight select-none">
            <span className="text-2xl md:text-3xl font-black text-neutral-950 tracking-[-0.03em]">
              Talk<span className="text-blue-600">Rx</span>
            </span>
          </Link>
        </div>

        {/* Centered Navigation Links & Conventional / AYUSH Mode Toggle */}
        <div className="flex flex-1 items-center justify-center gap-6 lg:gap-8 px-4">
          <nav className="hidden xl:flex items-center gap-6 text-[11px] font-bold uppercase tracking-[1.2px] text-neutral-700">
            <Link
              href="/case-taking"
              className="text-neutral-950 border-b-2 border-black pb-0.5 font-bold transition-colors"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Case-Taking
            </Link>
            <Link
              href="/doctor-dashboard"
              className="hover:text-neutral-950 transition-colors"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Doctor
            </Link>
            <Link
              href="/triage-operations"
              className="hover:text-neutral-950 transition-colors"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Triage &amp; Ops
            </Link>
            <Link
              href="/pharmacy-network"
              className="hover:text-neutral-950 transition-colors"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Pharmacy
            </Link>
            <Link
              href="/health-passport"
              className="hover:text-neutral-950 transition-colors"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Passport
            </Link>
            <Link
              href="/document-intelligence"
              className="hover:text-neutral-950 transition-colors"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Document AI
            </Link>
          </nav>

          {/* Centered Segmented Pill Toggle */}
          <div className="inline-flex items-center rounded-full border border-neutral-300/80 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setMode("conventional")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-all ${
                mode === "conventional"
                  ? "bg-neutral-100/90 text-neutral-950 font-bold shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Conventional
            </button>
            <button
              type="button"
              onClick={() => setMode("ayush")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-all ${
                mode === "ayush"
                  ? "bg-neutral-100/90 text-neutral-950 font-bold shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              <Leaf className="h-3.5 w-3.5 text-neutral-700 stroke-[1.75]" />
              <span>AYUSH Mode</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            Exit Kiosk
          </Link>
        </div>
      </header>

      {/* Step Navigation Progress Timeline Bar */}
      <div className="relative z-10 border-b border-black/[0.06] bg-white/50 px-6 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-8 overflow-x-auto py-3.5 scrollbar-none">
          {stepsList.map((stepName, idx) => {
            const isActive = stepName === currentStepName;
            return (
              <button
                key={stepName}
                type="button"
                onClick={() => setCurrentQIndex(idx % QUESTIONS.length)}
                className="group relative pb-2 text-left whitespace-nowrap transition-all"
              >
                <span
                  className={`text-[11px] md:text-[12px] font-bold uppercase tracking-[1.5px] transition-colors ${
                    isActive ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-600"
                  }`}
                  style={{ fontFamily: "var(--do-font-label)" }}
                >
                  {stepName}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00bba6] transition-all" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Question Stage */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10 text-center md:px-12">
        {/* Red Flag Emergency Banner if triggered */}
        {hasRedFlag && redFlagAlert && (
          <div className="mb-6 w-full max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/[0.04] p-4 text-left backdrop-blur-md shadow-sm animate-fadeIn">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider text-red-700"
                    style={{ fontFamily: "var(--do-font-label)" }}
                  >
                    Deterministic Red-Flag Alert &bull; Priority Triage
                  </span>
                  <span className="text-xs font-mono text-neutral-500">{redFlagAlert.timestamp}</span>
                </div>
                <div className="text-xs font-bold text-neutral-950 mt-0.5">
                  ACS CRITERIA SATISFIED: Central chest tightness radiating to arm + diaphoresis
                </div>
                <div className="text-[11px] text-neutral-600 mt-0.5">
                  Automated priority alert dispatched to Hospital Emergency Desk #1.
                </div>
              </div>
            </div>
          </div>
        )}

        {!isComplete ? (
          <div className="w-full max-w-3xl space-y-5">
            {/* Step Counter Label with Turquoise Dot */}
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00bba6]" />
              <span
                className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#00bba6]"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                Question {activeQuestion.stepIndex} of {activeQuestion.totalSteps}
              </span>
            </div>

            {/* Main Question Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-[60px] lg:leading-[64px] font-normal tracking-tight text-neutral-950">
              {currentQuestionText}
            </h2>

            {/* Spoken translation subtitle */}
            {activeQuestion.indicPrompt[selectedLang] && (
              <p className="text-sm md:text-base font-normal text-neutral-500 italic">
                &ldquo;{activeQuestion.indicPrompt[selectedLang]}&rdquo;
              </p>
            )}

            {/* Quick-select suggestion chips */}
            <div className="flex flex-wrap justify-center gap-2.5 pt-3 max-w-2xl mx-auto">
              {currentSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(suggestion)}
                  className="rounded-full border border-[#00bba6]/20 bg-white/95 backdrop-blur-md px-5 py-2.5 text-xs md:text-sm font-medium text-neutral-800 hover:border-[#00bba6] hover:bg-[#eef9f8] hover:text-[#009688] transition-all shadow-sm"
                  style={{ fontFamily: "var(--do-font-label)" }}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Audio Voice Waveform Dots Indicator */}
            <div className="flex items-center justify-center gap-1.5 pt-6">
              {Array.from({ length: 22 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    isListening
                      ? "bg-[#00bba6] animate-pulse"
                      : i % 2 === 0
                      ? "bg-[#00bba6]"
                      : "bg-[#00bba6]/30"
                  }`}
                  style={{
                    animationDelay: `${i * 40}ms`,
                    transform: isListening ? `scaleY(${1 + (i % 3)})` : "none",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Case-Taking Complete View -> Direct link to Customer Dashboard */
          <div className="w-full max-w-xl space-y-6 rounded-[28px] border border-[#00bba6]/20 bg-white/95 p-8 shadow-[0_20px_50px_rgba(0,187,166,0.1)] text-center backdrop-blur-2xl">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-[#dcf5f2] text-[#009688]">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-950">
                {isSaving ? "Saving to Health Passport…" : "Case-Taking Complete • History Recorded"}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mt-1">
                {isSaving
                  ? "AI is extracting structured clinical data from your intake — this only takes a moment."
                  : "Your structured clinical data has been securely saved to your TalkRx Health Passport and queued for physician consultation."}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/health-passport"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#00bba6] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#009688] shadow-md transition-all"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                <span>Go to Customer Dashboard &amp; Upload Reports</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsComplete(false);
                  setCurrentQIndex(0);
                  setHasRedFlag(false);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Restart Intake</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Pill Input Bar & Provenance */}
      <div className="relative z-10 flex flex-col items-center pb-24 md:pb-8 px-4 sm:px-6">
        <div className="w-full max-w-2xl">
          {/* Floating Pill Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3 rounded-full border border-[#00bba6]/20 bg-white p-2 pl-5 shadow-[0_10px_35px_rgba(0,187,166,0.08)] backdrop-blur-2xl transition-all focus-within:border-[#00bba6]"
          >
            {/* Mic button */}
            <button
              type="button"
              onClick={handleMicToggle}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "text-neutral-400 hover:text-[#00bba6]"
              }`}
              title="Click to speak"
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening to voice..." : "Type your answer..."}
              className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />

            {/* Turquoise Send Button */}
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00bba6] text-white shadow-md hover:bg-[#009688] transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Centered Patient Token Provenance */}
          <div className="mt-3.5 text-center">
            <span
              className="text-[10px] font-mono font-medium uppercase tracking-[1.5px] text-neutral-400"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              {patientTag}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
