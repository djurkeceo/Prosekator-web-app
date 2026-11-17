export const APP_NAME = "Prosekator";
export const APP_DESCRIPTION =
  "Besplatna aplikacija za praćenje školskog proseka i ocena. Računaj prosek, analiziraj predmete i prati napredak.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prosekator.vercel.app";
export const CONTACT_EMAIL = "prosekator.app@gmail.com";
export const GITHUB_URL = "https://github.com/djurkeceo/Prosekator-web-app";

export const SUBJECT_COLORS = [
  "#2B2BFF",
  "#1F9D6B",
  "#C9A227",
  "#D64545",
  "#7C5CFF",
  "#0E7490",
  "#B45309",
  "#BE185D",
  "#4F46E5",
  "#047857",
  "#6D28D9",
  "#B91C1C",
  "#0369A1",
  "#A16207",
  "#9D174D",
  "#0F766E",
  "#4338CA",
  "#15803D",
  "#C2410C",
  "#7E22CE",
  "#1D4ED8",
  "#065F46",
  "#BE123C",
  "#A21CAF",
  "#CA8A04",
  "#0E7490",
  "#6B7280",
  "#374151",
  "#9CA3AF",
  "#111827",
] as const;

export const COMMON_SUBJECTS = [
  "Matematika",
  "Srpski jezik",
  "Engleski jezik",
  "Fizika",
  "Hemija",
  "Biologija",
  "Istorija",
  "Geografija",
  "Informatika",
  "Likovna kultura",
  "Muzička kultura",
  "Fizičko vaspitanje",
];

export const GRADE_VALUES = [1, 2, 3, 4, 5] as const;

export const GRADE_COLORS: Record<number, string> = {
  1: "#D64545",
  2: "#E08A3C",
  3: "#C9A227",
  4: "#1F9D6B",
  5: "#2B2BFF",
};

export const GRADE_LABELS: Record<number, string> = {
  1: "Nedovoljan",
  2: "Dovoljan",
  3: "Dobar",
  4: "Vrlo dobar",
  5: "Odličan",
};

export const QUICK_DESCRIPTIONS = [
  "Pismeni zadatak",
  "Usmeni odgovor",
  "Test",
  "Domaći",
  "Projekat",
];

export const STORAGE_KEYS = {
  guest: "prosekator.guest.v1",
  cachePrefix: "prosekator.cache.v1.",
  theme: "prosekator-theme",
} as const;
