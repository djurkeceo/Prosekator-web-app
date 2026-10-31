import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Prijava",
  description: "Prijavi se na Prosekator i nastavi da pratiš ocene i prosek na svim uređajima.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) redirect("/");

  return (
    <AuthShell
      eyebrow="Dobrodošao nazad"
      title="Prijavi se"
      subtitle="Nastavi tačno tamo gde si stao. Predmeti i ocene čekaju na tvom nalogu."
    >
      <LoginForm />
    </AuthShell>
  );
}
