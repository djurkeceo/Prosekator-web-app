"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
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
  const pathname = usePathname();
  const router = useRouter();
  const pendingHomeScroll = useRef(false);

  useEffect(() => {
    if (!pendingHomeScroll.current || pathname !== href) return;

    pendingHomeScroll.current = false;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [href, pathname]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    pendingHomeScroll.current = true;
    router.push(href);
  };

  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Prosekator — početna"
      onClick={handleClick}
    >
      <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[4px] ring-1 ring-line transition-all duration-200 group-hover:-translate-y-0.5 group-hover:rotate-2 group-hover:shadow-soft">
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
        <span className="flex items-baseline gap-1.5">
          <span className="font-mono text-[17px] font-medium lowercase tracking-[-0.04em] text-fg transition group-hover:text-accent-strong">
            prosekator
          </span>
          <span className="hidden font-mono text-[9px] text-muted sm:inline">v2.0</span>
        </span>
      ) : null}
    </Link>
  );
}
