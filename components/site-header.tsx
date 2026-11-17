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
      <header className="sticky top-0 z-50 border-b border-line bg-[var(--header-bg)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-8">
              <BrandMark />

              <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Glavna navigacija">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative rounded-[4px] px-2.5 py-2 text-[13px] font-medium transition-colors",
                        active ? "text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"
                      )}
                    >
                      {active ? (
                        <span
                          className="mr-1.5 inline-block h-1.5 w-1.5 rounded-[1px] bg-accent-soft align-middle"
                          aria-hidden="true"
                        />
                      ) : null}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />

              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="flex h-9 items-center gap-2 rounded-[4px] border border-line bg-surface py-1 pl-1 pr-2.5 text-[12px] font-medium text-fg transition hover:border-line-strong hover:bg-surface-2"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-accent text-[10px] font-semibold text-accent-fg">
                      {getInitials(user.name)}
                    </span>
                    <span className="hidden max-w-28 truncate sm:block">{user.name}</span>
                    <ChevronDown
                      className={cn(
                        "hidden h-3.5 w-3.5 text-muted transition sm:block",
                        userMenuOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {userMenuOpen ? (
                    <div
                      className="animate-fade-up absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-[8px] border border-line bg-surface shadow-strong"
                      role="menu"
                    >
                      <div className="border-b border-line px-3 py-2.5">
                        <p className="fig-label">nalog</p>
                        <p className="mt-1 truncate text-[13px] font-medium">{user.name}</p>
                        <p className="truncate text-[11px] text-muted">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            setAccountOpen(true);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2.5 text-left text-[12px] text-muted transition hover:bg-surface-2 hover:text-fg"
                          role="menuitem"
                        >
                          <Settings2 className="h-3.5 w-3.5" />
                          Podešavanja naloga
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2.5 text-left text-[12px] text-danger transition hover:bg-danger-soft disabled:opacity-60"
                          role="menuitem"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          {loggingOut ? "Odjavljivanje…" : "Odjavi se"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="hidden items-center gap-1.5 sm:flex">
                  <Link href="/login" className="btn btn-ghost">
                    <LogIn className="h-3.5 w-3.5" />
                    Prijavi se
                  </Link>
                  <Link href="/signup" className="btn btn-primary">
                    <Sparkles className="h-3.5 w-3.5" />
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
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <div
              id="mobile-navigation"
              className="animate-fade-up border-t border-line pb-4 pt-2 lg:hidden"
            >
              <nav className="grid" aria-label="Mobilna navigacija">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex min-h-11 items-center justify-between border-b border-line font-mono text-[12px] transition-colors",
                        active ? "text-fg" : "text-muted hover:text-fg"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {active ? (
                          <span className="h-1.5 w-1.5 rounded-[1px] bg-accent-soft" aria-hidden="true" />
                        ) : null}
                        {link.label}
                      </span>
                      <span className="text-muted">→</span>
                    </Link>
                  );
                })}
              </nav>

              {user ? (
                <div className="mt-4 grid gap-2">
                  <div className="flex items-center gap-3 rounded-[4px] border border-line bg-surface-2 p-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-accent text-[10px] font-semibold text-accent-fg">
                      {getInitials(user.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{user.name}</p>
                      <p className="truncate text-[11px] text-muted">{user.email}</p>
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
                    <Settings2 className="h-3.5 w-3.5" />
                    Podešavanja naloga
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="btn btn-danger w-full"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {loggingOut ? "Odjavljivanje…" : "Odjavi se"}
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid gap-2">
                  <Link
                    href="/login"
                    className="btn btn-secondary w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Prijavi se
                  </Link>
                  <Link
                    href="/signup"
                    className="btn btn-primary w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Napravi nalog
                  </Link>
                  <p className="flex items-center justify-center gap-1.5 pt-1 text-center font-mono text-[10px] text-muted">
                    <UserRound className="h-3 w-3" />
                    gost režim radi bez naloga
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
