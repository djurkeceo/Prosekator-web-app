export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PasswordRequirement = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "length",
    label: "Najmanje 8 karaktera",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "Bar jedno veliko slovo",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "Bar jedan broj",
    test: (password) => /[0-9]/.test(password),
  },
];

export function isEmailValid(email: string): boolean {
  return EMAIL_PATTERN.test(String(email || "").trim());
}

export function getPasswordIssues(password: string): string[] {
  return PASSWORD_REQUIREMENTS.filter((requirement) => !requirement.test(password)).map(
    (requirement) => requirement.label
  );
}

export function isPasswordStrong(password: string): boolean {
  return getPasswordIssues(password).length === 0;
}

export function getPasswordScore(password: string): number {
  if (!password) return 0;
  const passed = PASSWORD_REQUIREMENTS.filter((requirement) => requirement.test(password)).length;
  const bonus = password.length >= 12 ? 1 : 0;
  return Math.min(4, passed + bonus);
}

export function normalizePersonName(name: string): string {
  return String(name || "").trim().replace(/\s+/g, " ");
}

export function isValidPersonName(name: string): boolean {
  const value = normalizePersonName(name);
  return value.length >= 2 && value.length <= 60;
}

export function isValidSubjectName(name: string): boolean {
  const value = String(name || "").trim();
  return value.length >= 1 && value.length <= 60;
}

export function isValidGradeValue(value: unknown): value is number {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 1 && numeric <= 5;
}

export function isValidDescription(value: string): boolean {
  return String(value || "").trim().length <= 160;
}
