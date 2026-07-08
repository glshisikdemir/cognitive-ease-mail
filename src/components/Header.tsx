import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
            <span className="font-display text-[13px] font-semibold leading-none">I</span>
          </span>
          <span className="text-sm font-semibold tracking-[0.04em] text-foreground">ISURA</span>
        </Link>
        <Link
          to="/pulse"
          className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open app
        </Link>
      </div>
    </header>
  );
}
