import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { AIPanel } from "@/components/AIPanel";
import { getEmail } from "@/lib/emails";
import { useLang, t } from "@/lib/i18n";

export const Route = createFileRoute("/email/$id")({
  loader: ({ params }) => {
    const email = getEmail(params.id);
    if (!email) throw notFound();
    return { email };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.email.subject} — ISURA` : "ISURA" },
    ],
  }),
  component: EmailDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-muted-foreground">Email not found.</p>
        <Link to="/" className="mt-4 inline-block text-sm underline">Back to inbox</Link>
      </div>
    </div>
  ),
});

function EmailDetail() {
  const { email } = Route.useLoaderData();
  const { lang } = useLang();
  const date = new Date(email.receivedAt).toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t(lang, "back")}
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
          {/* Left: original email */}
          <article className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
            <header className="border-b border-border/70 px-7 py-6">
              <h1 className="font-display text-2xl leading-tight text-foreground">{email.subject}</h1>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                  {email.sender[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{email.sender}</div>
                  <div className="truncate text-xs text-muted-foreground">{email.senderEmail} · {date}</div>
                </div>
              </div>
            </header>
            <div className="px-7 py-6">
              <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-foreground">
                {email.body}
              </pre>
            </div>
          </article>

          {/* Right: AI panel */}
          <aside className="rounded-2xl border border-border/70 bg-surface lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
            <AIPanel email={email} />
          </aside>
        </div>
      </main>
    </div>
  );
}
