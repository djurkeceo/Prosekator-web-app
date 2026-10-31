import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Registracija",
  description:
    "Napravi besplatan Prosekator nalog i sačuvaj predmete i ocene u oblaku, na svim uređajima.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

export default async function SignupPage() {
  const user = await getSessionUser();

  if (user) redirect("/");

  return (
    <AuthShell
      eyebrow="Besplatan nalog"
      title="Napravi nalog"
      subtitle="Sačuvaj svoj prosek u oblaku i pristupi mu sa telefona, tableta ili računara."
    >
      <SignupForm />
    </AuthShell>
  );
}
