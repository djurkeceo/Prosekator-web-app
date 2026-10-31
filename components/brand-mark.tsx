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
      className={cn("group inline-flex items-center gap-2.5 rounded-full", className)}
      aria-label="Prosekator — početna"
    >
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-2 sm:h-10 sm:w-10">
        <Image
          src="/favicon.svg"
          alt=""
          width={32}
          height={32}
          priority
          unoptimized
          className="h-7 w-7 sm:h-8 sm:w-8"
        />
      </span>
      {!compact ? (
        <span className="text-[1.05rem] font-extrabold tracking-tight text-fg transition group-hover:text-accent-strong sm:text-lg">
          Prosekator
        </span>
      ) : null}
    </Link>
  );
}
