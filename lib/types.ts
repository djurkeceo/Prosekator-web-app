export type Grade = {
  id: string;
  value: number;
  description: string;
  createdAt: string;
};

export type Subject = {
  id: string;
  name: string;
  color: string;
  grades: Grade[];
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type GradebookData = {
  user: User;
  subjects: Subject[];
};

export type AuthResponse = {
  user: User;
};

export type GradeInput = {
  id?: string;
  value: number;
  description?: string;
  createdAt?: string;
};

export type SubjectInput = {
  name: string;
  color?: string;
  grades?: GradeInput[];
};

export type Trend = {
  direction: "up" | "down" | "flat" | "none";
  delta: number;
  label: string;
};

export type GradebookStats = {
  overallAverage: number;
  gradedSubjects: number;
  totalSubjects: number;
  totalGrades: number;
  bestGrade: number | null;
  worstGrade: number | null;
  bestSubjectName: string | null;
  bestSubjectAverage: number | null;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  trend: Trend;
  roundedAverage: number;
};

export type GoalPlan = {
  currentAverage: number;
  target: number;
  gradedSubjects: number;
  ungradedSubjects: number;
  extraSubjects: number;
  remainingSubjects: number;
  requiredAverage: number | null;
  maxPossibleAverage: number | null;
  status: "empty" | "secured" | "reachable" | "impossible" | "no-grades";
};
