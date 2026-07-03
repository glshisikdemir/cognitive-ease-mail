import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Target,
  Loader2,
  Mic,
  Send,
  ChevronRight,
  ChevronLeft,
  Check,
  Play,
  SkipForward,
  ShieldAlert,
  Sparkles,
  Search,
  Users,
  Mail,
  Database,
  Calendar,
  BarChart3,
  BookOpen,
  Brain,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { ProductFooter } from "@/components/ProductFooter";
import { useLang } from "@/lib/i18n";
import {
  createObjective,
  listObjectives,
  getObjective,
  updateTaskStatus,
  type ObjectiveRow,
  type TaskRow,
  type TaskAgent,
  type TaskStatus,
} from "@/lib/objectives.functions";

export const Route = createFileRoute("/objectives")({
  head: () => ({
    meta: [
      { title: "Objectives · ISURA" },
      {
        name: "description",
        content:
          "Describe an objective in plain language. ISURA decomposes it into a plan and coordinates specialized agents to execute it.",
      },
    ],
  }),
  component: ObjectivesPage,
});

const AGENT_ICON: Record<TaskAgent, typeof Search> = {
  research: Search,
  sales: Users,
  email: Mail,
  crm: Database,
  calendar: Calendar,
  analytics: BarChart3,
  knowledge: BookOpen,
  decision: Brain,
  planner: Compass,
};

const AGENT_KEY: Record<TaskAgent, string> = {
  research: "taskAgentResearch",
  sales: "taskAgentSales",
  email: "taskAgentEmail",
  crm: "taskAgentCrm",
  calendar: "taskAgentCalendar",
  analytics: "taskAgentAnalytics",
  knowledge: "taskAgentKnowledge",
  decision: "taskAgentDecision",
  planner: "taskAgentPlanner",
};

const STATUS_STYLE: Record<TaskStatus, string> = {
  pending: "bg-muted/50 text-muted-foreground ring-border/60",
  ready: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/30",
  running: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/30",
  blocked: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/30",
  awaiting_approval: "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/40",
  done: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30",
  failed: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/30",
  skipped: "bg-muted/40 text-muted-foreground ring-border/50 line-through",
};

const EXAMPLES_EN = [
  "Find 500 charter schools in Florida",
  "Prepare an outbound campaign",
  "Summarize yesterday and set next week's priorities",
];
const EXAMPLES_TR = [
  "Florida'da 500 charter okul bul",
  "Bir tanıtım kampanyası hazırla",
  "Dünü özetle ve gelecek haftanın önceliklerini belirle",
];

function ObjectivesPage() {
  const { lang, t } = useLang();
  const create = useServerFn(createObjective);
  const list = useServerFn(listObjectives);
  const getОne = useServerFn(getObjective);
  const setTask = useServerFn(updateTaskStatus);

  const [objectives, setObjectives] = useState<ObjectiveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<{ objective: ObjectiveRow; tasks: TaskRow[] } | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [busyTask, setBusyTask] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const examples = lang === "tr" ? EXAMPLES_TR : EXAMPLES_EN;

  const refresh = useCallback(() => {
    return list({})
      .then(setObjectives)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [list]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openObjective = useCallback(
    (id: string) => {
      setSelectedLoading(true);
      getОne({ data: { id } })
        .then(setSelected)
        .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
        .finally(() => setSelectedLoading(false));
    },
    [getОne],
  );

  const handleCreate = async (source: "voice" | "text", value: string) => {
    const title = value.trim();
    if (title.length < 3) return;
    setCreating(true);
    try {
      const { id } = await create({ data: { title, source, language: lang } });
      setInput("");
      await refresh();
      openObjective(id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Planning failed");
    } finally {
      setCreating(false);
    }
  };

  const startVoice = () => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error(lang === "tr" ? "Tarayıcı ses tanımayı desteklemiyor" : "Voice not supported in this browser");
      return;
    }
    const rec = new SR();
    rec.lang = lang === "tr" ? "tr-TR" : "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript as string;
      setListening(false);
      handleCreate("voice", text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  const changeTask = async (taskId: string, status: TaskStatus) => {
    setBusyTask(taskId);
    try {
      await setTask({ data: { id: taskId, status } });
      setSelected((prev) =>
        prev
          ? { ...prev, tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) }
          : prev,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyTask(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
        {!selected ? (
          <>
            <header className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
                <Target className="h-3.5 w-3.5" />
                {t("objTitle")}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("objTitle")}</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">{t("objTagline")}</p>
            </header>

            <div className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCreate("text", input);
                  }}
                  rows={2}
                  placeholder={t("objInputPlaceholder")}
                  className="min-h-[52px] flex-1 resize-none rounded-xl border border-border/70 bg-background px-3.5 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                  aria-label={t("objInputPlaceholder")}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startVoice}
                    disabled={creating || listening}
                    className={`inline-flex h-[52px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium ring-1 transition ${
                      listening
                        ? "bg-rose-500/15 text-rose-600 ring-rose-500/40 dark:text-rose-400"
                        : "bg-background text-foreground ring-border/70 hover:bg-muted/50"
                    }`}
                    aria-label={t("objSpeak")}
                  >
                    <Mic className="h-4 w-4" />
                    <span className="hidden sm:inline">{listening ? t("objListening") : t("objSpeak")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCreate("text", input)}
                    disabled={creating || input.trim().length < 3}
                    className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
                  >
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="hidden sm:inline">{creating ? t("objPlanning") : t("objCreate")}</span>
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{t("objExamples")}</span>
                {examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setInput(ex)}
                    className="rounded-full bg-muted/60 px-2.5 py-1 ring-1 ring-border/50 transition hover:bg-muted"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : objectives.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold">{t("objEmptyTitle")}</h2>
                  <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">{t("objEmptyBody")}</p>
                </div>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {objectives.map((o) => (
                    <li key={o.id}>
                      <button
                        type="button"
                        onClick={() => openObjective(o.id)}
                        className="group flex w-full flex-col gap-2 rounded-2xl border border-border/70 bg-card/60 p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-medium leading-snug">{o.title}</span>
                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>
                        {o.summary ? (
                          <span className="line-clamp-2 text-sm text-muted-foreground">{o.summary}</span>
                        ) : null}
                        <span className="mt-1 inline-flex w-fit items-center rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground ring-1 ring-border/50">
                          {o.status}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <ObjectiveDetail
            data={selected}
            loading={selectedLoading}
            busyTask={busyTask}
            onBack={() => {
              setSelected(null);
              refresh();
            }}
            onTask={changeTask}
            t={t}
          />
        )}
      </main>
      <ProductFooter />
    </div>
  );
}

function ObjectiveDetail({
  data,
  loading,
  busyTask,
  onBack,
  onTask,
  t,
}: {
  data: { objective: ObjectiveRow; tasks: TaskRow[] };
  loading: boolean;
  busyTask: string | null;
  onBack: () => void;
  onTask: (id: string, status: TaskStatus) => void;
  t: (k: string) => string;
}) {
  const { objective, tasks } = data;
  const done = tasks.filter((x) => x.status === "done").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("objBack")}
      </button>

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{objective.title}</h1>
      {objective.summary ? <p className="mt-2 max-w-2xl text-muted-foreground">{objective.summary}</p> : null}

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm text-muted-foreground">
          {done}/{tasks.length} {t("objDone")}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <ol className="mt-6 space-y-3">
          {tasks.map((task, i) => {
            const Icon = AGENT_ICON[task.agent];
            const busy = busyTask === task.id;
            return (
              <li
                key={task.id}
                className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium leading-snug">{task.title}</span>
                    </div>
                    {task.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                    ) : null}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border/50">
                        {t(AGENT_KEY[task.agent])}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${STATUS_STYLE[task.status]}`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                      {task.requires_approval ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-300">
                          <ShieldAlert className="h-3 w-3" />
                          {t("objReqApproval")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    {task.status !== "done" && task.status !== "skipped" ? (
                      <>
                        {task.requires_approval && task.status !== "running" ? (
                          <TaskBtn
                            busy={busy}
                            onClick={() => onTask(task.id, "running")}
                            icon={Check}
                            label={t("objApprove")}
                            tone="primary"
                          />
                        ) : task.status !== "running" ? (
                          <TaskBtn
                            busy={busy}
                            onClick={() => onTask(task.id, "running")}
                            icon={Play}
                            label={t("objRun")}
                          />
                        ) : null}
                        <TaskBtn
                          busy={busy}
                          onClick={() => onTask(task.id, "done")}
                          icon={Check}
                          label={t("objComplete")}
                          tone="success"
                        />
                        <TaskBtn
                          busy={busy}
                          onClick={() => onTask(task.id, "skipped")}
                          icon={SkipForward}
                          label={t("objSkip")}
                        />
                      </>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function TaskBtn({
  busy,
  onClick,
  icon: Icon,
  label,
  tone = "default",
}: {
  busy: boolean;
  onClick: () => void;
  icon: typeof Check;
  label: string;
  tone?: "default" | "primary" | "success";
}) {
  const tones: Record<string, string> = {
    default: "bg-background text-foreground ring-border/70 hover:bg-muted/60",
    primary: "bg-primary text-primary-foreground ring-primary/40 hover:opacity-90",
    success: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 hover:bg-emerald-500/20 dark:text-emerald-400",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      title={label}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ring-1 transition disabled:opacity-50 ${tones[tone]}`}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
