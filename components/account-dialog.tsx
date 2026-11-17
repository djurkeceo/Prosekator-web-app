"use client";

import { Check, KeyRound, ShieldAlert, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { apiErrorMessage, apiFetch } from "@/lib/api-client";
import type { AuthResponse } from "@/lib/types";
import {
  PASSWORD_REQUIREMENTS,
  getPasswordIssues,
  isValidPersonName,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type AccountDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function AccountDialog({ open, onClose }: AccountDialogProps) {
  const { user, updateUser, clearUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(user?.name || "");
      setNameError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    }
  }, [open, user?.name]);

  if (!user) return null;

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNameError("");

    if (!isValidPersonName(name)) {
      setNameError("Ime mora imati između 2 i 60 karaktera.");
      return;
    }

    if (name.trim() === user.name) {
      setNameError("Novo ime je isto kao trenutno.");
      return;
    }

    setNameLoading(true);

    try {
      const data = await apiFetch<AuthResponse>("/api/user/update", {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      updateUser(data.user);
      toast({ title: "Ime je sačuvano.", variant: "success" });
    } catch (error) {
      setNameError(apiErrorMessage(error));
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Unesi trenutnu lozinku.");
      return;
    }

    const issues = getPasswordIssues(newPassword);
    if (issues.length) {
      setPasswordError("Nova lozinka još nije dovoljno jaka.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Nove lozinke se ne poklapaju.");
      return;
    }

    setPasswordLoading(true);

    try {
      await apiFetch<AuthResponse>("/api/user/update", {
        method: "PATCH",
        body: JSON.stringify({ password: newPassword, currentPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Lozinka je promenjena.", variant: "success" });
    } catch (error) {
      setPasswordError(apiErrorMessage(error));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      await apiFetch<{ success: boolean }>("/api/user/delete", { method: "DELETE" });
      clearUser();
      setDeleteOpen(false);
      onClose();
      toast({ title: "Nalog je obrisan.", description: "Svi podaci su trajno uklonjeni." });
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast({ title: "Nalog nije obrisan.", description: apiErrorMessage(error), variant: "error" });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Podešavanja naloga"
        description="Upravljaj imenom, lozinkom i nalogom na jednom mestu."
        size="lg"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-line bg-accent-soft text-yellow-fg">
            <UserRound className="h-4 w-4" />
          </span>
        }
      >
        <div className="space-y-7">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <UserRound className="h-3.5 w-3.5 text-accent-strong" />
              <h3 className="font-mono text-[13px] font-medium">Profil</h3>
            </div>

            <div className="border border-line bg-surface-2 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[9px] text-muted">email</p>
                  <p className="truncate text-[12px] font-medium text-fg">{user.email}</p>
                </div>
                <span className="badge badge-green">aktivan</span>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-3">
                <div>
                  <label htmlFor="account-name" className="label">
                    Korisničko ime
                  </label>
                  <input
                    id="account-name"
                    className="input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={60}
                    autoComplete="name"
                    aria-invalid={Boolean(nameError)}
                  />
                  {nameError ? (
                    <p className="mt-1.5 text-[11px] text-danger">{nameError}</p>
                  ) : null}
                </div>
                <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={nameLoading}>
                  {nameLoading ? <Spinner /> : null}
                  Sačuvaj ime
                </button>
              </form>
            </div>
          </section>

          <div className="hairline" />

          <section>
            <div className="mb-3 flex items-center gap-2">
              <KeyRound className="h-3.5 w-3.5 text-accent-strong" />
              <h3 className="font-mono text-[13px] font-medium">Lozinka</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label htmlFor="current-password" className="label">
                  Trenutna lozinka
                </label>
                <PasswordInput
                  id="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="new-password" className="label">
                    Nova lozinka
                  </label>
                  <PasswordInput
                    id="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-new-password" className="label">
                    Potvrdi novu lozinku
                  </label>
                  <PasswordInput
                    id="confirm-new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    aria-invalid={Boolean(confirmPassword && newPassword !== confirmPassword)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {PASSWORD_REQUIREMENTS.map((requirement) => {
                  const passed = requirement.test(newPassword);
                  return (
                    <span
                      key={requirement.id}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[10px]",
                        passed ? "text-green" : "text-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-3.5 w-3.5 items-center justify-center rounded-[2px] border",
                          passed ? "border-line bg-accent-soft text-yellow-fg" : "border-line"
                        )}
                      >
                        {passed ? <Check className="h-2.5 w-2.5" /> : null}
                      </span>
                      {requirement.label}
                    </span>
                  );
                })}
              </div>

              {passwordError ? (
                <p
                  className="border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-danger-soft px-3 py-2 text-[10.5px] text-danger"
                  role="alert"
                >
                  {passwordError}
                </p>
              ) : null}

              <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={passwordLoading}>
                {passwordLoading ? <Spinner /> : null}
                Promeni lozinku
              </button>
            </form>
          </section>

          <div className="hairline" />

          <section>
            <div className="mb-3 flex items-center gap-2 text-danger">
              <ShieldAlert className="h-3.5 w-3.5" />
              <h3 className="font-mono text-[13px] font-medium">Opasna zona</h3>
            </div>
            <div className="flex flex-col gap-3 border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[12px] font-medium text-fg">Brisanje naloga</p>
                <p className="mt-1 text-[10.5px] leading-5 text-muted">
                  Trajno uklanja nalog, predmete i sve ocene iz baze.
                </p>
              </div>
              <button type="button" onClick={() => setDeleteOpen(true)} className="btn btn-danger shrink-0">
                Obriši nalog
              </button>
            </div>
          </section>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Obrisati nalog?"
        description={`Nalog ${user.email} i svi podaci biće trajno obrisani. Ova akcija se ne može poništiti.`}
        confirmLabel="Obriši trajno"
        loading={deleteLoading}
        variant="danger"
      />
    </>
  );
}
