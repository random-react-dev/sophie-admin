-- Creates table for tracking API usage (tokens, cost) for admin analytics
-- Note: Actual logging happens from mobile app; this prepares admin side

CREATE TABLE IF NOT EXISTS public.api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  model TEXT NOT NULL,
  function_name TEXT,
  cost_cents NUMERIC(10,4) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for efficient querying by user and date
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_id ON public.api_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON public.api_usage_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Only service_role can access (admin dashboard uses service_role)
DROP POLICY IF EXISTS "Service role full access" ON public.api_usage_logs;
CREATE POLICY "Service role full access" ON public.api_usage_logs
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow authenticated users to insert their own logs (for mobile app)
DROP POLICY IF EXISTS "Users can insert own logs" ON public.api_usage_logs;
CREATE POLICY "Users can insert own logs" ON public.api_usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
