/**
 * CityCascade i18n dictionary — English + Bangla.
 *
 * Keep keys flat, UPPER_SNAKE_CASE for easy grep. All strings referenced
 * from UI components live here so Bangla translators can edit one file.
 * The AI plan (from /api/ai/plan) is returned by the LLM already in the
 * requested language; no client-side translation for its content.
 */
export type Lang = "en" | "bn";

export const DICT: Record<string, { en: string; bn: string }> = {
  // Header
  HEADER_TITLE: { en: "CityCascade", bn: "সিটিক্যাসকেড" },
  HEADER_TAGLINE: { en: "AI · Disaster Ops v0.9", bn: "এআই · দুর্যোগ অপস v0.9" },
  HEADER_THEME: { en: "Theme", bn: "থিম" },
  HEADER_LANG: { en: "বাংলা", bn: "English" },
  HEADER_SIGNIN: { en: "Sign in", bn: "সাইন ইন" },
  HEADER_SIGNIN_SOON: { en: "Firebase auth — coming soon", bn: "ফায়ারবেস অথ — শীঘ্রই" },
  HEADER_SETTINGS: { en: "Settings", bn: "সেটিংস" },

  // Status bar
  STATUS_CITY: { en: "City", bn: "শহর" },
  STATUS_LIVE_EDGE: { en: "Live Edge", bn: "লাইভ এজ" },
  STATUS_STANDBY: { en: "Standby", bn: "স্ট্যান্ডবাই" },
  STATUS_SIMULATING: { en: "Simulating", bn: "সিমুলেটিং" },
  STATUS_ACTIVE: { en: "Active", bn: "সক্রিয়" },
  STATUS_ERROR: { en: "Error", bn: "ত্রুটি" },
  STATUS_UTC: { en: "UTC", bn: "ইউটিসি" },

  // Risk summary cards
  RS_AFFECTED_POP: { en: "Affected Population", bn: "প্রভাবিত জনসংখ্যা" },
  RS_HOSP_STRAIN: { en: "Hospital Strain", bn: "হাসপাতাল চাপ" },
  RS_ROADS_BLOCKED: { en: "Roads Blocked", bn: "বন্ধ সড়ক" },
  RS_WATER: { en: "Water Contamination", bn: "পানি দূষণ" },
  RS_DISEASE: { en: "Disease Risk", bn: "রোগের ঝুঁকি" },
  RS_IDLE: { en: "idle", bn: "অলস" },

  // Sidebar sections
  SB_COMMAND: { en: "Command Console", bn: "কমান্ড কনসোল" },
  SB_OPERATOR: { en: "Operator · City Ops Desk", bn: "অপারেটর · সিটি অপস ডেস্ক" },
  SB_CITY: { en: "City Grid", bn: "সিটি গ্রিড" },
  SB_CITY_SEARCH: { en: "Search cities (Dhaka, Tokyo, Manila...)", bn: "শহর খুঁজুন (ঢাকা, টোকিও, ম্যানিলা...)" },
  SB_NO_CITY: { en: "No cities match — try another name", bn: "কোনো শহর নেই — অন্য নাম চেষ্টা করুন" },
  SB_SOON: { en: "Soon", bn: "শীঘ্রই" },
  SB_DISASTER: { en: "Disaster Vector", bn: "দুর্যোগ ভেক্টর" },
  SB_INTENSITY: { en: "Intensity", bn: "তীব্রতা" },
  SB_TARGET: { en: "Target", bn: "লক্ষ্য" },
  SB_TARGET_NONE: { en: "City-wide (no zone picked)", bn: "পুরো শহর (কোনো জোন নির্বাচিত নয়)" },
  SB_POP_RISK: { en: "POP · BASE RISK", bn: "জনসংখ্যা · মূল ঝুঁকি" },
  SB_BRUSH: { en: "Brush Mode", bn: "ব্রাশ মোড" },
  SB_ON: { en: "ON", bn: "চালু" },
  SB_OFF: { en: "OFF", bn: "বন্ধ" },
  SB_RUN: { en: "Run Cascade", bn: "ক্যাসকেড চালান" },
  SB_RUNNING: { en: "Simulating...", bn: "সিমুলেটিং..." },
  SB_RESET: { en: "Reset Simulation", bn: "সিমুলেশন রিসেট" },
  SB_MIN: { en: "min", bn: "ন্যূনতম" },
  SB_MOD: { en: "mod", bn: "মাঝারি" },
  SB_SEVERE: { en: "severe", bn: "গুরুতর" },
  SB_MAX: { en: "max", bn: "সর্বোচ্চ" },
  SB_LEVEL: { en: "Level", bn: "স্তর" },

  // Map
  MAP_TITLE: { en: "Tactical Map", bn: "কৌশলগত মানচিত্র" },
  MAP_LEGEND_STABLE: { en: "Stable", bn: "স্থিতিশীল" },
  MAP_LEGEND_ELEVATED: { en: "Elevated", bn: "উচ্চতর" },
  MAP_LEGEND_CRITICAL: { en: "Critical", bn: "সংকটজনক" },
  MAP_INIT: { en: "Initialising tactical map...", bn: "কৌশলগত মানচিত্র চালু হচ্ছে..." },
  MAP_AWAITING: { en: "Awaiting input", bn: "ইনপুটের অপেক্ষায়" },
  MAP_AWAITING_DESC: {
    en: "Select a disaster, then click a zone or anywhere on the map.",
    bn: "একটি দুর্যোগ নির্বাচন করুন, তারপর একটি জোন বা মানচিত্রের যেকোনো জায়গায় ক্লিক করুন।",
  },
  MAP_SIM: { en: "Simulating cascade...", bn: "ক্যাসকেড সিমুলেটিং..." },
  MAP_SIM_DESC: {
    en: "Modeling zone propagation · Intensity",
    bn: "জোন প্রসারণ মডেলিং · তীব্রতা",
  },
  MAP_ERR: { en: "Map / telemetry fault", bn: "মানচিত্র / টেলিমেট্রি ত্রুটি" },
  MAP_ERR_DESC: {
    en: "Tile stream lost. Reset the field or retry the cascade.",
    bn: "টাইল স্ট্রিম হারিয়ে গেছে। রিসেট করুন বা আবার চেষ্টা করুন।",
  },
  MAP_EPI: { en: "Epicenter", bn: "ভূকম্পকেন্দ্র" },
  MAP_EPI_NULL: { en: "null", bn: "কিছু নেই" },

  // Risk side panels
  PANEL_ZONE_RISK: { en: "Zone Risk Index", bn: "জোন ঝুঁকি সূচক" },
  PANEL_HOSP: { en: "Hospital Capacity", bn: "হাসপাতাল সক্ষমতা" },
  PANEL_ROAD: { en: "Road Disruption", bn: "সড়ক বিঘ্ন" },
  PANEL_AWAITING: { en: "awaiting data", bn: "ডেটার অপেক্ষায়" },
  PANEL_STANDBY: { en: "standby", bn: "স্ট্যান্ডবাই" },
  PANEL_NO_SIM: { en: "No active simulation", bn: "সক্রিয় সিমুলেশন নেই" },
  PANEL_NO_CAP: { en: "No live capacity data", bn: "লাইভ ক্যাপাসিটি ডেটা নেই" },
  PANEL_NO_INC: { en: "No incidents", bn: "কোনো ঘটনা নেই" },
  PANEL_ROAD_CLEAR: { en: "Road network clear", bn: "সড়ক নেটওয়ার্ক পরিষ্কার" },

  // AI panel
  AI_TITLE: { en: "AI Response Plan", bn: "এআই রেসপন্স প্ল্যান" },
  AI_EMPTY: { en: "Plan unavailable · run a simulation", bn: "প্ল্যান অনুপলব্ধ · একটি সিমুলেশন চালান" },
  AI_COMPILING: { en: "Compiling directives...", bn: "নির্দেশাবলী সংকলন করা হচ্ছে..." },
  AI_FAILED: { en: "Generation failed · retry", bn: "জেনারেশন ব্যর্থ · পুনরায় চেষ্টা" },
  AI_CONF: { en: "Plan generated · confidence", bn: "প্ল্যান তৈরি · আত্মবিশ্বাস" },
  AI_ETA: { en: "ETA", bn: "ইটিএ" },
  AI_MIN: { en: "min", bn: "মিনিট" },
  AI_AREA_WIDE: { en: "Area-wide", bn: "এলাকাব্যাপী" },
  AI_RESET_FIELD: { en: "Reset Field", bn: "ফিল্ড রিসেট" },
  AI_GENERATE: { en: "Generate AI plan", bn: "এআই প্ল্যান তৈরি" },
  AI_PIPE_DOWN: { en: "AI pipeline unreachable", bn: "এআই পাইপলাইন অনুপলব্ধ" },
  AI_PIPE_DOWN_DESC: {
    en: "Failed to compile response. Verify telemetry, then retry generation.",
    bn: "রেসপন্স সংকলন ব্যর্থ। টেলিমেট্রি যাচাই করুন, তারপর আবার চেষ্টা করুন।",
  },
  AI_AWAITING: {
    en: "Awaiting simulation to build a response plan.",
    bn: "রেসপন্স প্ল্যান তৈরি করতে সিমুলেশনের অপেক্ষায়।",
  },
  AI_STREAMING: { en: "Streaming directives from cascade model...", bn: "ক্যাসকেড মডেল থেকে নির্দেশ স্ট্রিম হচ্ছে..." },
  AI_SEC_ROUTE: { en: "Emergency Routing", bn: "জরুরি রাউটিং" },
  AI_SEC_HOSP: { en: "Hospital Allocation", bn: "হাসপাতাল বরাদ্দ" },
  AI_SEC_HEALTH: { en: "Public Health", bn: "জনস্বাস্থ্য" },
  AI_SEC_INFRA: { en: "Infrastructure", bn: "অবকাঠামো" },
  AI_SEC_EVAC: { en: "Evacuation", bn: "স্থানান্তর" },
  AI_SEC_ALERT: { en: "Citizen Alerts", bn: "নাগরিক সতর্কতা" },

  // Disasters
  DIS_flood: { en: "Urban Flood", bn: "শহুরে বন্যা" },
  DIS_fire: { en: "Building Fire", bn: "ভবনে আগুন" },
  DIS_rain: { en: "Heavy Rain", bn: "ভারী বৃষ্টি" },
  DIS_earthquake: { en: "Earthquake", bn: "ভূমিকম্প" },
  DIS_crash: { en: "Major Road Accident", bn: "বড় সড়ক দুর্ঘটনা" },
  DIS_dengue: { en: "Dengue Outbreak", bn: "ডেঙ্গু প্রাদুর্ভাব" },
  DIS_smog: { en: "Air Pollution Spike", bn: "বায়ু দূষণ বৃদ্ধি" },
  DIS_outage: { en: "Power Outage", bn: "বিদ্যুৎ বিভ্রাট" },
  DIS_waste: { en: "Waste Overflow", bn: "বর্জ্য উপচে পড়া" },
  DIS_water: { en: "Water Contamination", bn: "পানি দূষণ" },

  // Settings modal
  SET_TITLE: { en: "AI Provider Settings", bn: "এআই প্রোভাইডার সেটিংস" },
  SET_DESC: {
    en: "Bring your own Gemini key, or point at a local OpenAI-compatible router (ollama, LM Studio).",
    bn: "আপনার নিজের জেমিনি কী ব্যবহার করুন, অথবা লোকাল ওপেনএআই-সামঞ্জস্যপূর্ণ রাউটার (ওল্লামা, এলএম স্টুডিও) সেট করুন।",
  },
  SET_PROVIDER: { en: "Provider", bn: "প্রোভাইডার" },
  SET_PROVIDER_TEMPLATE: { en: "Template (no LLM, instant)", bn: "টেমপ্লেট (কোনো এলএলএম নয়, তাৎক্ষণিক)" },
  SET_PROVIDER_GEMINI: { en: "Google Gemini (bring your own key)", bn: "গুগল জেমিনি (নিজের কী আনুন)" },
  SET_PROVIDER_LOCAL: {
    en: "Local / OpenAI-compatible router (ollama, LM Studio, OpenRouter)",
    bn: "লোকাল / ওপেনএআই-সামঞ্জস্যপূর্ণ রাউটার (ওল্লামা, এলএম স্টুডিও, ওপেনরাউটার)",
  },
  SET_KEY: { en: "API key", bn: "এপিআই কী" },
  SET_KEY_HOLDER: { en: "leave blank to keep the current key", bn: "বর্তমান কী রাখতে ফাঁকা রাখুন" },
  SET_BASE: { en: "Base URL", bn: "বেস ইউআরএল" },
  SET_BASE_HOLDER: { en: "http://localhost:11434/v1", bn: "http://localhost:11434/v1" },
  SET_MODEL: { en: "Model", bn: "মডেল" },
  SET_MODEL_HOLDER: { en: "e.g. gemini-2.0-flash-exp or llama3.1:latest", bn: "যেমন gemini-2.0-flash-exp বা llama3.1:latest" },
  SET_SAVE: { en: "Save", bn: "সংরক্ষণ" },
  SET_SAVED: { en: "Saved", bn: "সংরক্ষিত" },
  SET_SAVING: { en: "Saving...", bn: "সংরক্ষণ করা হচ্ছে..." },
  SET_CANCEL: { en: "Cancel", bn: "বাতিল" },

  // Generic
  CLOSE: { en: "Close", bn: "বন্ধ" },
};

export function tr(key: string, lang: Lang): string {
  const row = DICT[key];
  if (!row) return key;
  return row[lang];
}

/** Bangla digits helper — use for numeric chrome like "06/10", "47 zones". */
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export function toBanglaDigits(input: string | number, lang: Lang): string {
  if (lang !== "bn") return String(input);
  return String(input).replace(/\d/g, (d) => BN_DIGITS[+d]);
}
