import { STORAGE_KEYS, SUBJECT_COLORS } from "@/lib/constants";
import type { Grade, Subject } from "@/lib/types";
import { generateId, isHexColor, safeJsonParse } from "@/lib/utils";
import { isValidGradeValue } from "@/lib/validation";

type CachedSubjects = {
  subjects: Subject[];
  savedAt: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function sanitizeClientSubjects(value: unknown): Subject[] {
  if (!Array.isArray(value)) return [];

  const subjectIds = new Set<string>();
  const subjects: Subject[] = [];

  value.forEach((rawSubject, subjectIndex) => {
    if (!rawSubject || typeof rawSubject !== "object") return;
    const record = rawSubject as Record<string, unknown>;
    const name = String(record.name || "").trim().slice(0, 60);
    if (!name) return;

    let id =
      typeof record.id === "string" && record.id
        ? record.id
        : typeof record._id === "string" && record._id
          ? record._id
          : generateId();

    if (subjectIds.has(id)) id = generateId();
    subjectIds.add(id);

    const rawGrades = Array.isArray(record.grades) ? record.grades : [];
    const gradeIds = new Set<string>();
    const grades: Grade[] = [];

    rawGrades.forEach((rawGrade) => {
      let value: unknown = rawGrade;
      let description = "";
      let createdAt = new Date().toISOString();
      let gradeId = generateId();

      if (rawGrade && typeof rawGrade === "object") {
        const gradeRecord = rawGrade as Record<string, unknown>;
        value = gradeRecord.value;
        description =
          typeof gradeRecord.description === "string"
            ? gradeRecord.description.trim().slice(0, 160)
            : "";
        gradeId =
          typeof gradeRecord.id === "string" && gradeRecord.id
            ? gradeRecord.id
            : generateId();

        if (gradeRecord.createdAt) {
          const parsed = new Date(String(gradeRecord.createdAt));
          if (!Number.isNaN(parsed.getTime())) createdAt = parsed.toISOString();
        }
      }

      const numeric = Number(value);
      if (!isValidGradeValue(numeric)) return;
      if (gradeIds.has(gradeId)) gradeId = generateId();
      gradeIds.add(gradeId);

      grades.push({ id: gradeId, value: numeric, description, createdAt });
    });

    const color = isHexColor(typeof record.color === "string" ? record.color : null)
      ? (record.color as string)
      : SUBJECT_COLORS[subjectIndex % SUBJECT_COLORS.length];

    subjects.push({ id, name, color, grades });
  });

  return subjects;
}

export function readGuestSubjects(): Subject[] {
  if (!isBrowser()) return [];

  try {
    return sanitizeClientSubjects(safeJsonParse<unknown>(localStorage.getItem(STORAGE_KEYS.guest), null));
  } catch {
    return [];
  }
}

export function hasGuestSubjects(): boolean {
  return readGuestSubjects().length > 0;
}

export function writeGuestSubjects(subjects: Subject[]): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.guest, JSON.stringify(subjects));
  } catch {
    // Ignore storage quota/private mode errors.
  }
}

export function clearGuestSubjects(): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(STORAGE_KEYS.guest);
  } catch {
    // Ignore.
  }
}

function cacheKey(userId: string): string {
  return `${STORAGE_KEYS.cachePrefix}${userId}`;
}

export function readCachedSubjects(userId: string): CachedSubjects | null {
  if (!isBrowser()) return null;

  try {
    const parsed = safeJsonParse<{ subjects?: unknown; savedAt?: unknown } | null>(
      localStorage.getItem(cacheKey(userId)),
      null
    );

    if (!parsed) return null;

    const subjects = sanitizeClientSubjects(parsed.subjects);
    if (!subjects.length) return null;

    const savedAt =
      typeof parsed.savedAt === "string" && !Number.isNaN(new Date(parsed.savedAt).getTime())
        ? parsed.savedAt
        : new Date().toISOString();

    return { subjects, savedAt };
  } catch {
    return null;
  }
}

export function writeCachedSubjects(userId: string, subjects: Subject[]): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(
      cacheKey(userId),
      JSON.stringify({ subjects, savedAt: new Date().toISOString() })
    );
  } catch {
    // Ignore.
  }
}

export function clearCachedSubjects(userId: string): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(cacheKey(userId));
  } catch {
    // Ignore.
  }
}
