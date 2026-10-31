import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: {
    absolute: "Prosekator — Kalkulator proseka i praćenje ocena",
  },
  description:
    "Besplatno izračunaj školski prosek, prati ocene po predmetima i simuliraj ciljni prosek. Radi i bez naloga i bez interneta.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <Dashboard />;
}
