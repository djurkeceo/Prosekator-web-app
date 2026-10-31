import { randomUUID } from "crypto";
import { SUBJECT_COLORS } from "@/lib/constants";
import type { UserRecord } from "@/lib/models/User";
import type { Grade, GradeInput, Subject, SubjectInput, User } from "@/lib/types";
import { isHexColor, pickNextColor } from "@/lib/utils";
import {
  isValidDescription,
  isValidGradeValue,
  isValidSubjectName,
  normalizePersonName,
} from "@/lib/validation";

export function toPublicUser(user: UserRecord): User {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
  };
}

function normalizeGrade(raw: unknown, fallbackDate: Date): Grade | null {
  let value: number | null = null;
  let description = "";
  let createdAt = fallbackDate;
  let id: string = randomUUID();

  if (typeof raw === "number" || (typeof raw === "string" && raw.trim() !== "")) {
    value = Number(raw);
  } else if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    value = Number(record.value);
    description = typeof record.description === "string" ? record.description.trim() : "";
    id =
      typeof record.id === "string" && record.id
        ? record.id
        : typeof record._id === "string" && record._id
          ? record._id
          : randomUUID();

    if (record.createdAt) {
      const parsed = new Date(String(record.createdAt));
      if (!Number.isNaN(parsed.getTime())) createdAt = parsed;
    }
  }

  if (value === null || !isValidGradeValue(value)) return null;
  if (!isValidDescription(description)) description = description.slice(0, 160);

  return {
    id,
    value,
    description,
    createdAt: createdAt.toISOString(),
  };
}

export type NormalizedSubject = Subject;

type NormalizeResult = {
  subject: NormalizedSubject;
  changed: boolean;
};

export function normalizeSubject(
  rawSubject: UserRecord["subjects"][number],
  index: number,
  usedColors: Set<string>
): NormalizeResult {
  let changed = false;
  const subjectId = String(rawSubject._id);
  const baseDate = rawSubject._id?.getTimestamp?.() ?? new Date();
  const seenIds = new Set<string>();
  const grades: Grade[] = [];

  const rawGrades = Array.isArray(rawSubject.grades) ? rawSubject.grades : [];

  rawGrades.forEach((raw, gradeIndex) => {
    if (typeof raw !== "object" || raw === null) changed = true;
    const normalized = normalizeGrade(raw, new Date(baseDate.getTime() + gradeIndex * 1000));
    if (!normalized) {
      changed = true;
      return;
    }

    if (seenIds.has(normalized.id)) {
      normalized.id = randomUUID();
      changed = true;
    }
    seenIds.add(normalized.id);
    grades.push(normalized);
  });

  let color = isHexColor(rawSubject.color) ? (rawSubject.color as string) : null;

  if (!color || usedColors.has(color)) {
    color = pickNextColor([...usedColors]);
    changed = true;
  }

  usedColors.add(color);

  return {
    subject: {
      id: subjectId,
      name: rawSubject.name,
      color,
      grades,
    },
    changed,
  };
}

export function normalizeAndSerializeUser(user: UserRecord): {
  user: User;
  subjects: Subject[];
  changed: boolean;
} {
  let changed = false;
  const usedColors = new Set<string>();
  const subjects: Subject[] = [];

  user.subjects.forEach((rawSubject, index) => {
    const result = normalizeSubject(rawSubject, index, usedColors);
    subjects.push(result.subject);
    if (result.changed) changed = true;

    if (result.changed) {
      rawSubject.grades = result.subject.grades.map((grade) => ({ ...grade }));
      rawSubject.color = result.subject.color;
      rawSubject.markModified?.("grades");
    }
  });

  return {
    user: toPublicUser(user),
    subjects,
    changed,
  };
}

export function buildNewSubject(input: SubjectInput, usedColors: string[]): NormalizedSubject {
  const name = normalizePersonName(input.name);
  const color = isHexColor(input.color) ? (input.color as string) : pickNextColor(usedColors);

  return {
    id: randomUUID(),
    name,
    color,
    grades: [],
  };
}

export function sanitizeGradeInputs(input: unknown): Grade[] | null {
  if (!Array.isArray(input)) return null;
  if (input.length > 200) return null;

  const seenIds = new Set<string>();
  const grades: Grade[] = [];

  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as GradeInput;
    const value = Number(item.value);

    if (!isValidGradeValue(value)) continue;

    const description = String(item.description || "").trim().slice(0, 160);
    const createdAt = item.createdAt ? new Date(item.createdAt) : new Date();
    let id = typeof item.id === "string" && item.id ? item.id : randomUUID();

    if (seenIds.has(id)) id = randomUUID();
    seenIds.add(id);

    grades.push({
      id,
      value,
      description,
      createdAt: Number.isNaN(createdAt.getTime())
        ? new Date().toISOString()
        : createdAt.toISOString(),
    });
  }

  return grades;
}

export function sanitizeSubjectName(value: unknown): string | null {
  const name = normalizePersonName(String(value || ""));
  return isValidSubjectName(name) ? name : null;
}

export function defaultColorForIndex(index: number): string {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}
