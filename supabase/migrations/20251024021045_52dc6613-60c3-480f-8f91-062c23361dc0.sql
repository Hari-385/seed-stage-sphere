-- Create investment decisions table
CREATE TABLE public.investment_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_analysis_id UUID NOT NULL REFERENCES public.pitch_analyses(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  granted_amount DECIMAL(15, 2),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(pitch_analysis_id, investor_id)
);

-- Enable RLS
ALTER TABLE public.investment_decisions ENABLE ROW LEVEL SECURITY;

-- Investors can create their own decisions
CREATE POLICY "Investors can create decisions"
ON public.investment_decisions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = investor_id AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'investor'::app_role
  )
);

-- Investors can update their own decisions
CREATE POLICY "Investors can update their decisions"
ON public.investment_decisions
FOR UPDATE
TO authenticated
USING (auth.uid() = investor_id)
WITH CHECK (auth.uid() = investor_id);

-- Investors can view their own decisions
CREATE POLICY "Investors can view their decisions"
ON public.investment_decisions
FOR SELECT
TO authenticated
USING (auth.uid() = investor_id);

-- Founders can view decisions on their pitches
CREATE POLICY "Founders can view decisions on their pitches"
ON public.investment_decisions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pitch_analyses pa
    JOIN public.startups s ON s.id = pa.startup_id
    WHERE pa.id = investment_decisions.pitch_analysis_id
    AND s.user_id = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_investment_decisions_updated_at
BEFORE UPDATE ON public.investment_decisions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Add investment preferences to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS investment_focus TEXT[],
ADD COLUMN IF NOT EXISTS min_investment_amount DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS max_investment_amount DECIMAL(15, 2);