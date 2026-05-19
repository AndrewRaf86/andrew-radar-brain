"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/ai-brain", label: "AI Brain" },
  { href: "/dating", label: "Dating" },
  { href: "/fitness-food", label: "Fitness/Food" },
  { href: "/brain-chat", label: "Brain Chat" },
  { href: "/inbox", label: "Inbox" },
  { href: "/reports", label: "Reports" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#07090d] text-zinc-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_30%)]" />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07090d]/88 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <Link href="/" className="group">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
                Private Signal OS
              </p>
              <p className="text-xl font-bold tracking-tight text-white">
                Andrew Radar Brain
              </p>
            </Link>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
              Mock data live
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "border-emerald-400/50 bg-emerald-400/12 text-emerald-200"
                      : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
