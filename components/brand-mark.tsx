import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  href = "/",
  className,
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Prosekator — početna"
    >
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden border-[3px] border-line bg-surface shadow-[3px_3px_0_var(--shadow-color)] transition-transform group-hover:-translate-y-0.5">
        <Image
          src="/favicon.svg"
          alt=""
          width={32}
          height={32}
          priority
          unoptimized
          className="h-8 w-8"
        />
      </span>
      {!compact ? (
        <span className="text-lg font-black uppercase tracking-tight text-fg transition group-hover:text-accent-strong sm:text-xl">
          Prosekator
        </span>
      ) : null}
    </Link>
  );
}
