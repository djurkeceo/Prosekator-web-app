"use client";

import {
  AlertTriangle,
  BookOpen,
  CloudCheck,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AddSubjectForm } from "@/components/dashboard/add-subject-form";
import { AverageHero } from "@/components/dashboard/average-hero";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { GoalSimulator } from "@/components/dashboard/goal-simulator";
import { GradeDialog } from "@/components/dashboard/grade-dialog";
import { GuestBanner, GuestDataBanner } from "@/components/dashboard/guest-banner";
import { InfoCard } from "@/components/dashboard/info-card";
import { RecentGrades } from "@/components/dashboard/recent-grades";
import { SubjectCard } from "@/components/dashboard/subject-card";
import { SubjectEditDialog } from "@/components/dashboard/subject-edit-dialog";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useGradebook } from "@/hooks/use-gradebook";
import { getStats } from "@/lib/calculations";
import type { Grade, Subject } from "@/lib/types";
import { formatTime } from "@/lib/utils";

type GradeDialogState = {
  subject: Subject;
  grade: Grade | null;
};

export function Dashboard() {
  const router = useRouter();
  const { user, clearUser } = useAuth();
  const { toast } = useToast();

  const handleUnauthorized = useCallback(() => {
    clearUser();
    router.refresh();
  }, [clearUser, router]);

  const gradebook = useGradebook(user, handleUnauthorized);
  const stats = useMemo(() => getStats(gradebook.subjects), [gradebook.subjects]);

  const [gradeDialog, setGradeDialog] = useState<GradeDialogState | null>(null);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [deleting, setDeleting] = useState(false);

  const existingNames = useMemo(
    () => gradebook.subjects.map((subject) => subject.name),
    [gradebook.subjects]
  );

  const firstName = user?.name.trim().split(/\s+/)[0] || "";

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    const success = await gradebook.deleteSubject(deleteTarget.id);
    setDeleting(false);

    if (success) {
      toast({
        title: "Predmet je obrisan.",
        description: `${deleteTarget.name} i sve njegove ocene su uklonjeni.`,
        variant: "success",
      });
      setDeleteTarget(null);
    }
  };

  return (
    <main id="main-content" className="flex-1 px-3 pb-10 pt-4 sm:px-4 sm:pt-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">
              {user ? `Zdravo${firstName ? `, ${firstName}` : ""}` : "Gost režim"}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Tvoj prosek
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!gradebook.online ? (
              <span className="badge bg-[color-mix(in_srgb,var(--warn)_16%,transparent)] text-warn">
                <WifiOff className="h-3.5 w-3.5" />
                Offline
              </span>
            ) : null}

            {gradebook.lastSavedAt ? (
              <span className="hidden items-center gap-1.5 text-[11px] font-semibold text-muted sm:flex">
                <CloudCheck className="h-3.5 w-3.5 text-accent-strong" />
                Sačuvano {formatTime(gradebook.lastSavedAt)}
              </span>
            ) : null}

            <button
              type="button"
              onClick={gradebook.reload}
              disabled={gradebook.status === "loading" || gradebook.isRefreshing}
              className="btn btn-secondary min-h-10 px-3"
              aria-label="Osveži podatke"
            >
              <RefreshCw
                className={`h-4 w-4 ${gradebook.isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Osveži</span>
            </button>
          </div>
        </div>

        {gradebook.status === "loading" ? (
          <DashboardSkeleton />
        ) : gradebook.status === "error" ? (
          <section className="card p-6 text-center sm:p-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-danger-soft text-danger">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold">Podaci nisu učitani</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              {gradebook.error || "Došlo je do greške pri učitavanju podataka."}
            </p>
            <button
              type="button"
              onClick={gradebook.reload}
              className="btn btn-primary mx-auto mt-5"
            >
              <RefreshCw className="h-4 w-4" />
              Pokušaj ponovo
            </button>
          </section>
        ) : (
          <div className="space-y-4">
            {gradebook.isGuest ? <GuestBanner /> : null}

            {!gradebook.isGuest && gradebook.hasGuestData ? (
              <GuestDataBanner
                isImporting={gradebook.isImporting}
                onImport={gradebook.importGuestData}
                onDiscard={gradebook.discardGuestData}
              />
            ) : null}

            <div className="animate-fade-up space-y-4">
              <AverageHero
                stats={stats}
                isGuest={gradebook.isGuest}
                isRefreshing={gradebook.isRefreshing}
              />

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  <AddSubjectForm
                    existingNames={existingNames}
                    isAdding={gradebook.isAddingSubject}
                    onAdd={gradebook.addSubject}
                  />

                  {gradebook.subjects.length === 0 ? (
                    <EmptyState
                      existingNames={existingNames}
                      isAdding={gradebook.isAddingSubject}
                      onAdd={gradebook.addSubject}
                    />
                  ) : (
                    <section aria-labelledby="subjects-heading">
                      <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
                        <h2
                          id="subjects-heading"
                          className="flex items-center gap-2 text-sm font-extrabold"
                        >
                          <BookOpen className="h-4 w-4 text-accent-strong" />
                          Predmeti
                          <span className="badge bg-surface-3 text-muted">
                            {gradebook.subjects.length}
                          </span>
                        </h2>
                        <span className="text-[11px] font-semibold text-muted">
                          {stats.gradedSubjects} sa ocenama
                        </span>
                      </div>

                      <div className="grid gap-3 xl:grid-cols-2">
                        {gradebook.subjects.map((subject, index) => (
                          <SubjectCard
                            key={subject.id}
                            subject={subject}
                            index={index}
                            isSaving={gradebook.savingIds.has(subject.id)}
                            onAddGrade={(item) =>
                              setGradeDialog({ subject: item, grade: null })
                            }
                            onEditGrade={(item, grade) =>
                              setGradeDialog({ subject: item, grade })
                            }
                            onEditSubject={setEditSubject}
                            onDelete={setDeleteTarget}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <aside className="space-y-4">
                  <GoalSimulator subjects={gradebook.subjects} />
                  <RecentGrades
                    subjects={gradebook.subjects}
                    onEditGrade={(subject, grade) =>
                      setGradeDialog({ subject, grade })
                    }
                  />
                  <InfoCard />
                </aside>
              </div>
            </div>

            {gradebook.isRefreshing ? (
              <p className="sr-only" role="status">
                <Spinner className="mr-2 inline h-3 w-3" />
                Osvežavanje podataka…
              </p>
            ) : null}
          </div>
        )}
      </div>

      <GradeDialog
        open={Boolean(gradeDialog)}
        subject={gradeDialog?.subject ?? null}
        editingGrade={gradeDialog?.grade ?? null}
        onClose={() => setGradeDialog(null)}
        onSave={async (grades) => {
          if (!gradeDialog) return false;
          return gradebook.saveGrades(gradeDialog.subject.id, grades);
        }}
      />

      <SubjectEditDialog
        open={Boolean(editSubject)}
        subject={editSubject}
        onClose={() => setEditSubject(null)}
        onSave={async (subjectId, name, color) => {
          const success = await gradebook.updateSubject(subjectId, { name, color });
          if (success) {
            toast({ title: "Predmet je sačuvan.", variant: "success" });
          }
          return success;
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Obrisati predmet?"
        description={
          deleteTarget
            ? `${deleteTarget.name} i sve njegove ocene biće trajno uklonjeni.`
            : ""
        }
        confirmLabel="Obriši predmet"
        loading={deleting}
        variant="danger"
      />
    </main>
  );
}
