export const APP_NAME = "Prosekator";
export const APP_DESCRIPTION =
  "Besplatna aplikacija za praćenje školskog proseka i ocena. Računaj prosek, analiziraj predmete i prati napredak.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prosekator.vercel.app";
export const CONTACT_EMAIL = "prosekator.app@gmail.com";
export const GITHUB_URL = "https://github.com/djurkeceo/Prosekator-web-app";

export const SUBJECT_COLORS = [
  "#B4D63D",
  "#4C8DFF",
  "#FF4D9D",
  "#FFC531",
  "#FF5C5C",
  "#2EE59D",
  "#FF8A3D",
  "#A66BFF",
  "#22C7E8",
  "#FF6EC7",
  "#55D400",
  "#D96BFF",
  "#FF7A45",
  "#4D7CFF",
  "#C77DFF",
  "#16D9C0",
  "#8CDF2A",
  "#FF4FD8",
  "#7B8CFF",
  "#F5D547",
  "#43E66B",
  "#FF8DD8",
  "#35D7FF",
  "#FFAD4D",
  "#B98CFF",
  "#F2C94C",
  "#3BE0C8",
  "#FF5EA8",
  "#A6F23C",
  "#66E8FF",
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
  1: "#FF5C5C",
  2: "#FF8A3D",
  3: "#F5C542",
  4: "#4ED47A",
  5: "#B4D63D",
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
