import type { GoalPlan, Grade, GradebookStats, Subject, Trend } from "@/lib/types";
import { clamp } from "@/lib/utils";

export function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatAverage(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return value.toFixed(2).replace(".", ",");
}

export function formatGrade(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return String(value);
}

export function getSubjectAverage(subject: Subject): number | null {
  if (!subject.grades.length) return null;
  const total = subject.grades.reduce((sum, grade) => sum + grade.value, 0);
  return total / subject.grades.length;
}

export function getOverallAverage(subjects: Subject[]): number {
  const averages = subjects
    .map((subject) => getSubjectAverage(subject))
    .filter((average): average is number => average !== null);

  if (!averages.length) return 0;

  return averages.reduce((sum, average) => sum + average, 0) / averages.length;
}

export function getAllGrades(subjects: Subject[]): Array<{ grade: Grade; subject: Subject }> {
  return subjects.flatMap((subject) =>
    subject.grades.map((grade) => ({ grade, subject }))
  );
}

export function getDistribution(subjects: Subject[]): Record<1 | 2 | 3 | 4 | 5, number> {
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  for (const subject of subjects) {
    for (const grade of subject.grades) {
      if (grade.value >= 1 && grade.value <= 5) {
        distribution[grade.value as 1 | 2 | 3 | 4 | 5] += 1;
      }
    }
  }

  return distribution;
}

export function getTrend(subjects: Subject[]): Trend {
  const grades = getAllGrades(subjects)
    .slice()
    .sort((a, b) => new Date(a.grade.createdAt).getTime() - new Date(b.grade.createdAt).getTime());

  if (grades.length < 2) {
    return { direction: "none", delta: 0, label: "Nema dovoljno podataka" };
  }

  const middle = Math.floor(grades.length / 2);
  const firstHalf = grades.slice(0, middle);
  const lastHalf = grades.slice(grades.length - middle);

  if (!firstHalf.length || !lastHalf.length) {
    return { direction: "none", delta: 0, label: "Nema dovoljno podataka" };
  }

  const average = (items: typeof grades) =>
    items.reduce((sum, item) => sum + item.grade.value, 0) / items.length;

  const delta = average(lastHalf) - average(firstHalf);

  if (delta > 0.1) {
    return { direction: "up", delta, label: "Napredak" };
  }

  if (delta < -0.1) {
    return { direction: "down", delta, label: "Blagi pad" };
  }

  return { direction: "flat", delta, label: "Stabilno" };
}

export function getStats(subjects: Subject[]): GradebookStats {
  const grades = getAllGrades(subjects);
  const overallAverage = getOverallAverage(subjects);
  const gradedSubjects = subjects.filter((subject) => subject.grades.length > 0);
  const values = grades.map((item) => item.grade.value);

  let bestSubjectName: string | null = null;
  let bestSubjectAverage: number | null = null;

  for (const subject of gradedSubjects) {
    const average = getSubjectAverage(subject);
    if (average === null) continue;

    if (bestSubjectAverage === null || average > bestSubjectAverage) {
      bestSubjectAverage = average;
      bestSubjectName = subject.name;
    }
  }

  return {
    overallAverage,
    gradedSubjects: gradedSubjects.length,
    totalSubjects: subjects.length,
    totalGrades: grades.length,
    bestGrade: values.length ? Math.max(...values) : null,
    worstGrade: values.length ? Math.min(...values) : null,
    bestSubjectName,
    bestSubjectAverage,
    distribution: getDistribution(subjects),
    trend: getTrend(subjects),
    roundedAverage: Math.round(overallAverage * 100) / 100,
  };
}

export function getRecentGrades(
  subjects: Subject[],
  limit = 5
): Array<{ grade: Grade; subject: Subject }> {
  return getAllGrades(subjects)
    .slice()
    .sort((a, b) => new Date(b.grade.createdAt).getTime() - new Date(a.grade.createdAt).getTime())
    .slice(0, limit);
}

export function getGoalPlan(
  subjects: Subject[],
  target: number,
  extraSubjects = 1
): GoalPlan {
  const currentAverage = getOverallAverage(subjects);
  const gradedSubjects = subjects.filter((subject) => subject.grades.length > 0).length;
  const ungradedSubjects = subjects.length - gradedSubjects;
  const safeTarget = clamp(Number.isFinite(target) ? target : 4.5, 1, 5);

  if (!subjects.length) {
    return {
      currentAverage,
      target: safeTarget,
      gradedSubjects,
      ungradedSubjects,
      extraSubjects: 0,
      remainingSubjects: 0,
      requiredAverage: null,
      maxPossibleAverage: null,
      status: "empty",
    };
  }

  if (!gradedSubjects) {
    return {
      currentAverage,
      target: safeTarget,
      gradedSubjects,
      ungradedSubjects,
      extraSubjects: 0,
      remainingSubjects: ungradedSubjects,
      requiredAverage: safeTarget,
      maxPossibleAverage: null,
      status: "no-grades",
    };
  }

  const remainingSubjects = ungradedSubjects + (ungradedSubjects > 0 ? 0 : Math.max(0, extraSubjects));
  const maxPossibleAverage =
    remainingSubjects > 0
      ? (currentAverage * gradedSubjects + 5 * remainingSubjects) /
        (gradedSubjects + remainingSubjects)
      : currentAverage;

  if (remainingSubjects === 0) {
    return {
      currentAverage,
      target: safeTarget,
      gradedSubjects,
      ungradedSubjects,
      extraSubjects,
      remainingSubjects,
      requiredAverage: null,
      maxPossibleAverage,
      status:
        currentAverage >= safeTarget
          ? "secured"
          : maxPossibleAverage < safeTarget
            ? "impossible"
            : "reachable",
    };
  }

  const requiredAverage =
    (safeTarget * (gradedSubjects + remainingSubjects) - currentAverage * gradedSubjects) /
    remainingSubjects;

  let status: GoalPlan["status"] = "reachable";
  if (currentAverage >= safeTarget && requiredAverage < 1) {
    status = "secured";
  } else if (maxPossibleAverage < safeTarget) {
    status = "impossible";
  } else if (requiredAverage < 1) {
    status = "secured";
  }

  return {
    currentAverage,
    target: safeTarget,
    gradedSubjects,
    ungradedSubjects,
    extraSubjects,
    remainingSubjects,
    requiredAverage,
    maxPossibleAverage,
    status,
  };
}
