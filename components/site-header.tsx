"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  Settings2,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AccountDialog } from "@/components/account-dialog";
import { BrandMark } from "@/components/brand-mark";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn, getInitials } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Prosek" },
  { href: "/about", label: "O aplikaciji" },
  { href: "/contact", label: "Kontakt" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    setUserMenuOpen(false);
    setMobileOpen(false);

    try {
      await logout();
      toast({ title: "Odjavljen si.", description: "Možeš nastaviti kao gost ili se ponovo prijaviti." });
      router.replace("/");
      router.refresh();
    } catch {
      toast({ title: "Odjava nije uspela.", variant: "error" });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b-[3px] border-line bg-[var(--header-bg)]">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <div className="relative flex h-16 items-center justify-between gap-2">
            <BrandMark />

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex" aria-label="Glavna navigacija">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "border-2 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition",
                      active
                        ? "border-line bg-accent-soft text-fg shadow-[3px_3px_0_var(--shadow-color)]"
                        : "border-transparent text-muted hover:border-line hover:text-fg"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />

              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="flex min-h-11 items-center gap-2 border-[3px] border-line bg-surface py-1 pl-1 pr-2.5 text-sm font-bold text-fg shadow-[3px_3px_0_var(--shadow-color)] transition hover:-translate-y-0.5 sm:pr-3"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                  >
                    <span className="flex h-8 w-8 items-center justify-center border-2 border-line bg-accent text-[11px] font-black text-accent-fg">
                      {getInitials(user.name)}
                    </span>
                    <span className="hidden max-w-32 truncate sm:block">{user.name}</span>
                    <ChevronDown
                      className={cn("hidden h-4 w-4 text-muted transition sm:block", userMenuOpen && "rotate-180")}
                    />
                  </button>

                  {userMenuOpen ? (
                    <div
                      className="card animate-fade-up absolute right-0 top-[calc(100%+10px)] z-50 w-64 p-2"
                      role="menu"
                    >
                      <div className="border-2 border-line bg-surface-2 px-3 py-2.5">
                        <p className="truncate text-sm font-bold">{user.name}</p>
                        <p className="truncate text-xs text-muted">{user.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setAccountOpen(true);
                        }}
                        className="mt-1.5 flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-semibold text-muted transition hover:bg-surface-2 hover:text-fg"
                        role="menuitem"
                      >
                        <Settings2 className="h-4 w-4" />
                        Podešavanja naloga
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-semibold text-danger transition hover:bg-danger-soft disabled:opacity-60"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" />
                        {loggingOut ? "Odjavljivanje…" : "Odjavi se"}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="hidden items-center gap-1.5 sm:flex">
                  <Link href="/login" className="btn btn-ghost">
                    <LogIn className="h-4 w-4" />
                    Prijavi se
                  </Link>
                  <Link href="/signup" className="btn btn-primary">
                    <Sparkles className="h-4 w-4" />
                    Napravi nalog
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                className="icon-btn lg:hidden"
                aria-label={mobileOpen ? "Zatvori meni" : "Otvori meni"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <div
              id="mobile-navigation"
              className="card animate-fade-up mb-3 mt-2 p-3 lg:hidden"
            >
              <nav className="grid gap-1" aria-label="Mobilna navigacija">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex min-h-12 items-center justify-between border-2 px-3.5 text-xs font-bold uppercase tracking-[0.08em] transition",
                        active
                          ? "border-line bg-accent-soft text-fg shadow-[3px_3px_0_var(--shadow-color)]"
                          : "border-transparent text-muted hover:border-line hover:text-fg"
                      )}
                    >
                      {link.label}
                      <span className="text-lg">→</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="my-3 hairline" />

              {user ? (
                <div className="grid gap-2">
                  <div className="flex items-center gap-3 border-2 border-line bg-surface-2 p-3">
                    <span className="flex h-9 w-9 items-center justify-center border-2 border-line bg-accent text-xs font-black text-accent-fg">
                      {getInitials(user.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{user.name}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setAccountOpen(true);
                    }}
                    className="btn btn-secondary w-full"
                  >
                    <Settings2 className="h-4 w-4" />
                    Podešavanja naloga
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="btn btn-danger w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Odjavljivanje…" : "Odjavi se"}
                  </button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Link href="/login" className="btn btn-secondary w-full" onClick={() => setMobileOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Prijavi se
                  </Link>
                  <Link href="/signup" className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>
                    <Sparkles className="h-4 w-4" />
                    Napravi nalog
                  </Link>
                  <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[11px] text-muted">
                    <UserRound className="h-3.5 w-3.5" />
                    Gost režim radi bez naloga
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </header>

      <AccountDialog open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
