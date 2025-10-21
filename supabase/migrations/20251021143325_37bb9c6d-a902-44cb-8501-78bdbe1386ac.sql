-- Create storage bucket for pitch files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pitch-files', 'pitch-files', false);

-- Create pitch_analyses table
CREATE TABLE public.pitch_analyses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  analysis_status text NOT NULL DEFAULT 'pending',
  
  -- Analysis results
  market_size_score integer,
  team_strength_score integer,
  product_viability_score integer,
  financial_health_score integer,
  competitive_advantage_score integer,
  overall_score integer,
  
  -- Detailed analysis
  key_strengths text[],
  key_concerns text[],
  market_insights text,
  team_analysis text,
  financial_summary text,
  risk_factors text[],
  investment_recommendation text,
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on pitch_analyses
ALTER TABLE public.pitch_analyses ENABLE ROW LEVEL SECURITY;

-- Founders can view their own pitch analyses
CREATE POLICY "Founders can view their own analyses"
ON public.pitch_analyses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.startups
    WHERE startups.id = pitch_analyses.startup_id
    AND startups.user_id = auth.uid()
  )
);

-- Founders can insert analyses for their startups
CREATE POLICY "Founders can insert analyses"
ON public.pitch_analyses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.startups
    WHERE startups.id = pitch_analyses.startup_id
    AND startups.user_id = auth.uid()
  )
);

-- Investors can view all analyses (for browsing startups)
CREATE POLICY "Investors can view all analyses"
ON public.pitch_analyses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'investor'
  )
);

-- Storage policies for pitch files
CREATE POLICY "Users can upload their startup pitch files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'pitch-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own pitch files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'pitch-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Investors can view all pitch files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'pitch-files'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'investor'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_pitch_analyses_updated_at
BEFORE UPDATE ON public.pitch_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();