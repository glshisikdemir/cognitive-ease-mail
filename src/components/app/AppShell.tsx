import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Radar, Users, FileText, Settings as Cog, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { pendingApprovalCount } from "@/lib/approvals";

const NAV = [
  { to: "/pulse", label: "Pulse", icon: Activity },
  { to: "/radar", label: "Radar", icon: Radar },
  { to: "/approvals", label: "Approvals", icon: ShieldCheck },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/drafts", label: "Drafts", icon: FileText },
  { to: "/settings", label: "Settings", icon: Cog },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const approvals = pendingApprovalCount();


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border/60 px-3 py-5 md:flex">
          <Link to="/pulse" className="mb-6 flex items-center gap-2.5 px-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <span className="font-display text-[13px] font-semibold leading-none">I</span>
            </span>
            <span className="text-sm font-semibold tracking-[0.04em]">ISURA</span>
          </Link>

          <nav className="flex flex-1 flex-col gap-0.5">
            {NAV.map((item) => {
              const active =
                item.to === "/clients"
                  ? pathname.startsWith("/clients")
                  : pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                    active
                      ? "bg-surface-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-surface-muted/60 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-lg border border-border/60 bg-surface px-3 py-3 text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Approval-first.</span> Nothing is ever
            sent without your tap.
          </div>
        </aside>

        {/* Mobile top nav */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 flex items-center gap-1 overflow-x-auto border-b border-border/60 bg-background/90 px-3 py-2 backdrop-blur md:hidden">
            {NAV.map((item) => {
              const active =
                item.to === "/clients" ? pathname.startsWith("/clients") : pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                    active ? "bg-foreground text-background" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <main className="min-w-0 flex-1 px-5 py-7 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
