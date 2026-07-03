
CREATE TYPE public.objective_status AS ENUM ('planning', 'active', 'paused', 'completed', 'archived');
CREATE TYPE public.objective_source AS ENUM ('voice', 'text');
CREATE TYPE public.task_type AS ENUM ('research', 'find', 'enrich', 'score', 'segment', 'message', 'approve', 'send', 'track', 'learn', 'other');
CREATE TYPE public.task_agent AS ENUM ('research', 'sales', 'email', 'crm', 'calendar', 'analytics', 'knowledge', 'decision', 'planner');
CREATE TYPE public.task_status AS ENUM ('pending', 'ready', 'running', 'blocked', 'awaiting_approval', 'done', 'failed', 'skipped');
CREATE TYPE public.objective_lang AS ENUM ('en', 'tr');

CREATE TABLE public.objectives (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  source objective_source NOT NULL DEFAULT 'text',
  language objective_lang NOT NULL DEFAULT 'en',
  status objective_status NOT NULL DEFAULT 'planning',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.objectives TO authenticated;
GRANT ALL ON public.objectives TO service_role;
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own objectives" ON public.objectives
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  objective_id uuid NOT NULL REFERENCES public.objectives(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  type task_type NOT NULL DEFAULT 'other',
  agent task_agent NOT NULL DEFAULT 'planner',
  title text NOT NULL,
  description text,
  status task_status NOT NULL DEFAULT 'pending',
  requires_approval boolean NOT NULL DEFAULT false,
  decision_id uuid REFERENCES public.decisions(id) ON DELETE SET NULL,
  depends_on jsonb NOT NULL DEFAULT '[]'::jsonb,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  result jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tasks" ON public.tasks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_tasks_objective ON public.tasks(objective_id, order_index);

CREATE TABLE public.agent_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  agent task_agent NOT NULL,
  status text NOT NULL DEFAULT 'started',
  output jsonb,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_runs TO authenticated;
GRANT ALL ON public.agent_runs TO service_role;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own agent runs" ON public.agent_runs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_agent_runs_task ON public.agent_runs(task_id);

CREATE TRIGGER set_objectives_updated_at BEFORE UPDATE ON public.objectives
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
