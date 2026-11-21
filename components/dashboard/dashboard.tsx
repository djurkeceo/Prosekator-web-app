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
    <main id="main-content" className="flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="premium-enter mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="fig-label">
              {user ? `zdravo${firstName ? `, ${firstName}` : ""} · nalog` : "gost režim · lokalno"}
            </p>
            <h1 className="mt-3 font-mono text-4xl leading-[0.95] tracking-[-0.05em] text-fg sm:text-5xl lg:text-6xl">
              Tvoj prosek<span className="text-info">.</span>
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-6 text-muted sm:text-sm">
              Ocene, statistika i simulator cilja — sve na jednom mestu, bez digitrona.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!gradebook.online ? (
              <span className="badge badge-yellow">
                <WifiOff className="h-3 w-3" />
                offline
              </span>
            ) : null}

            {gradebook.lastSavedAt ? (
              <span className="hidden items-center gap-1.5 font-mono text-[9.5px] text-muted sm:flex">
                <CloudCheck className="h-3 w-3 text-green" />
                sačuvano {formatTime(gradebook.lastSavedAt)}
              </span>
            ) : null}

            <button
              type="button"
              onClick={gradebook.reload}
              disabled={gradebook.status === "loading" || gradebook.isRefreshing}
              className="btn btn-secondary min-h-9 px-3"
              aria-label="Osveži podatke"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${gradebook.isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Osveži</span>
            </button>
          </div>
        </div>

        {gradebook.status === "loading" ? (
          <DashboardSkeleton />
        ) : gradebook.status === "error" ? (
          <section className="card p-6 text-center sm:p-8">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] border border-line bg-danger-soft text-danger">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-mono text-xl tracking-tight">Podaci nisu učitani.</h2>
            <p className="mx-auto mt-2 max-w-md text-[12px] leading-6 text-muted">
              {gradebook.error || "Došlo je do greške pri učitavanju podataka."}
            </p>
            <button
              type="button"
              onClick={gradebook.reload}
              className="btn btn-primary mx-auto mt-5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
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
                          className="flex items-center gap-2 font-mono text-[13px] font-medium"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-accent-strong" />
                          Predmeti
                          <span className="badge">{gradebook.subjects.length}</span>
                        </h2>
                        <span className="font-mono text-[9.5px] text-muted">
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
