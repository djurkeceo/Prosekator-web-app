"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { apiErrorMessage, apiFetch, ApiError } from "@/lib/api-client";
import {
  clearGuestSubjects,
  hasGuestSubjects,
  readCachedSubjects,
  readGuestSubjects,
  sanitizeClientSubjects,
  writeCachedSubjects,
  writeGuestSubjects,
} from "@/lib/client-storage";
import type { Grade, Subject, User } from "@/lib/types";
import { generateId, pickNextColor } from "@/lib/utils";
import { useOnlineStatus } from "@/hooks/use-online-status";

export type GradebookStatus = "loading" | "ready" | "error";

type SubjectPatch = {
  name?: string;
  color?: string;
};

export function useGradebook(user: User | null, onUnauthorized?: () => void) {
  const { toast } = useToast();
  const online = useOnlineStatus();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [status, setStatus] = useState<GradebookStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [hasGuestData, setHasGuestData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const subjectsRef = useRef<Subject[]>([]);
  const requestRef = useRef(0);
  const previousOnlineRef = useRef(online);

  const commit = useCallback(
    (next: Subject[], persist = true) => {
      subjectsRef.current = next;
      setSubjects(next);
      setLastSavedAt(new Date());

      if (!persist) return;

      if (user) {
        writeCachedSubjects(user.id, next);
      } else {
        writeGuestSubjects(next);
      }
    },
    [user]
  );

  const markSaving = useCallback((subjectId: string, busy: boolean) => {
    setSavingIds((current) => {
      const next = new Set(current);
      if (busy) next.add(subjectId);
      else next.delete(subjectId);
      return next;
    });
  }, []);

  const handleApiError = useCallback(
    (err: unknown, title: string): boolean => {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized?.();
        toast({
          title: "Sesija je istekla",
          description: "Prijavi se ponovo da bi nastavio da čuvaš podatke na nalogu.",
          variant: "error",
        });
        return true;
      }

      toast({ title, description: apiErrorMessage(err), variant: "error" });
      return false;
    },
    [onUnauthorized, toast]
  );

  const loadUserData = useCallback(
    async (showLoader: boolean) => {
      if (!user) return;

      const requestId = ++requestRef.current;
      if (showLoader) setStatus("loading");
      else setIsRefreshing(true);

      try {
        const data = await apiFetch<{ subjects: Subject[] }>("/api/user/data");
        if (requestId !== requestRef.current) return;

        const normalized = sanitizeClientSubjects(data.subjects);
        subjectsRef.current = normalized;
        setSubjects(normalized);
        setStatus("ready");
        setError(null);
        setLastSavedAt(new Date());
        writeCachedSubjects(user.id, normalized);
      } catch (err) {
        if (requestId !== requestRef.current) return;

        if (err instanceof ApiError && err.status === 401) {
          onUnauthorized?.();
          setStatus("ready");
          return;
        }

        const cached = readCachedSubjects(user.id);

        if (cached) {
          subjectsRef.current = cached.subjects;
          setSubjects(cached.subjects);
          setLastSavedAt(new Date(cached.savedAt));
          setStatus("ready");
          if (typeof navigator === "undefined" || navigator.onLine) {
            handleApiError(err, "Podaci nisu osveženi");
          }
        } else {
          setStatus("error");
          setError(apiErrorMessage(err));
        }
      } finally {
        if (requestId === requestRef.current) setIsRefreshing(false);
      }
    },
    [handleApiError, onUnauthorized, user]
  );

  useEffect(() => {
    if (!user) {
      const guestSubjects = readGuestSubjects();
      subjectsRef.current = guestSubjects;
      setSubjects(guestSubjects);
      setStatus("ready");
      setError(null);
      setHasGuestData(false);
      setLastSavedAt(null);
      return;
    }

    setHasGuestData(hasGuestSubjects());
    const cached = readCachedSubjects(user.id);

    if (cached) {
      subjectsRef.current = cached.subjects;
      setSubjects(cached.subjects);
      setLastSavedAt(new Date(cached.savedAt));
      setStatus("ready");
    } else {
      setStatus("loading");
    }

    void loadUserData(!cached);
  }, [loadUserData, user]);

  useEffect(() => {
    const wasOnline = previousOnlineRef.current;
    previousOnlineRef.current = online;

    if (user && online && !wasOnline) {
      void loadUserData(false);
    }
  }, [loadUserData, online, user]);

  const addSubject = useCallback(
    async (name: string): Promise<boolean> => {
      const trimmed = name.trim().slice(0, 60);
      if (!trimmed) return false;

      const duplicate = subjectsRef.current.some(
        (subject) => subject.name.trim().toLowerCase() === trimmed.toLowerCase()
      );

      if (duplicate) {
        toast({
          title: "Predmet već postoji",
          description: "Izmeni postojeći predmet ili unesi drugačiji naziv.",
          variant: "error",
        });
        return false;
      }

      if (!user) {
        const next = [
          ...subjectsRef.current,
          {
            id: generateId(),
            name: trimmed,
            color: pickNextColor(subjectsRef.current.map((subject) => subject.color)),
            grades: [],
          },
        ];
        commit(next);
        return true;
      }

      setIsAddingSubject(true);

      try {
        const data = await apiFetch<{ subject: Subject }>("/api/user/subjects", {
          method: "POST",
          body: JSON.stringify({ name: trimmed }),
        });

        if (!data.subject) throw new Error("Predmet nije vraćen sa servera.");

        const next = [...subjectsRef.current, data.subject];
        commit(next);
        return true;
      } catch (err) {
        handleApiError(err, "Predmet nije dodat");
        return false;
      } finally {
        setIsAddingSubject(false);
      }
    },
    [commit, handleApiError, toast, user]
  );

  const updateSubject = useCallback(
    async (subjectId: string, patch: SubjectPatch): Promise<boolean> => {
      const previous = subjectsRef.current;
      const next = previous.map((subject) =>
        subject.id === subjectId ? { ...subject, ...patch } : subject
      );

      commit(next);

      if (!user) return true;

      markSaving(subjectId, true);

      try {
        const data = await apiFetch<{ subject: Subject }>(`/api/user/subjects/${subjectId}`, {
          method: "PATCH",
          body: JSON.stringify(patch),
        });

        if (data.subject) {
          const merged = subjectsRef.current.map((subject) =>
            subject.id === subjectId ? data.subject : subject
          );
          commit(merged);
        }

        return true;
      } catch (err) {
        commit(previous);
        handleApiError(err, "Izmene nisu sačuvane");
        return false;
      } finally {
        markSaving(subjectId, false);
      }
    },
    [commit, handleApiError, markSaving, user]
  );

  const deleteSubject = useCallback(
    async (subjectId: string): Promise<boolean> => {
      const previous = subjectsRef.current;
      const next = previous.filter((subject) => subject.id !== subjectId);
      commit(next);

      if (!user) return true;

      markSaving(subjectId, true);

      try {
        await apiFetch<{ success: boolean }>(`/api/user/subjects/${subjectId}`, {
          method: "DELETE",
        });
        return true;
      } catch (err) {
        commit(previous);
        handleApiError(err, "Predmet nije obrisan");
        return false;
      } finally {
        markSaving(subjectId, false);
      }
    },
    [commit, handleApiError, markSaving, user]
  );

  const saveGrades = useCallback(
    async (subjectId: string, grades: Grade[]): Promise<boolean> => {
      const previous = subjectsRef.current;
      const next = previous.map((subject) =>
        subject.id === subjectId ? { ...subject, grades } : subject
      );

      commit(next);

      if (!user) return true;

      markSaving(subjectId, true);

      try {
        const data = await apiFetch<{ subject: Subject }>("/api/user/grades", {
          method: "POST",
          body: JSON.stringify({
            subjectId,
            grades: grades.map(({ id, value, description, createdAt }) => ({
              id,
              value,
              description,
              createdAt,
            })),
          }),
        });

        if (data.subject) {
          const merged = subjectsRef.current.map((subject) =>
            subject.id === subjectId ? data.subject : subject
          );
          commit(merged);
        }

        return true;
      } catch (err) {
        commit(previous);
        handleApiError(err, "Ocena nije sačuvana");
        return false;
      } finally {
        markSaving(subjectId, false);
      }
    },
    [commit, handleApiError, markSaving, user]
  );

  const importGuestData = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    const guestSubjects = readGuestSubjects();
    if (!guestSubjects.length) {
      setHasGuestData(false);
      return false;
    }

    setIsImporting(true);

    try {
      const data = await apiFetch<{ subjects: Subject[] }>("/api/user/import", {
        method: "POST",
        body: JSON.stringify({ subjects: guestSubjects }),
      });

      const normalized = sanitizeClientSubjects(data.subjects);
      commit(normalized);
      clearGuestSubjects();
      setHasGuestData(false);

      toast({
        title: "Lokalni podaci su preneti",
        description: "Predmeti i ocene sada su sačuvani na tvom nalogu.",
        variant: "success",
      });
      return true;
    } catch (err) {
      handleApiError(err, "Podaci nisu preneti");
      return false;
    } finally {
      setIsImporting(false);
    }
  }, [commit, handleApiError, toast, user]);

  const discardGuestData = useCallback(() => {
    clearGuestSubjects();
    setHasGuestData(false);
    toast({ title: "Lokalni podaci su uklonjeni.", variant: "info" });
  }, [toast]);

  const reload = useCallback(() => {
    if (user) {
      void loadUserData(subjectsRef.current.length === 0);
      return;
    }

    const guestSubjects = readGuestSubjects();
    subjectsRef.current = guestSubjects;
    setSubjects(guestSubjects);
    setStatus("ready");
    setError(null);
  }, [loadUserData, user]);

  return {
    subjects,
    status,
    error,
    isGuest: !user,
    hasGuestData,
    isRefreshing,
    isAddingSubject,
    isImporting,
    lastSavedAt,
    savingIds,
    online,
    addSubject,
    updateSubject,
    deleteSubject,
    saveGrades,
    importGuestData,
    discardGuestData,
    reload,
  };
}
