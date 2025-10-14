-- Create startups table
CREATE TABLE public.startups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo TEXT NOT NULL DEFAULT '🚀',
  domain TEXT NOT NULL,
  stage TEXT NOT NULL,
  funding TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;

-- Startups are viewable by everyone
CREATE POLICY "Startups are viewable by everyone"
ON public.startups
FOR SELECT
USING (true);

-- Users can insert their own startups (founders)
CREATE POLICY "Founders can create their own startups"
ON public.startups
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own startups
CREATE POLICY "Founders can update their own startups"
ON public.startups
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own startups
CREATE POLICY "Founders can delete their own startups"
ON public.startups
FOR DELETE
USING (auth.uid() = user_id);

-- Create saved_startups table for investors to save startups
CREATE TABLE public.saved_startups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, startup_id)
);

-- Enable RLS
ALTER TABLE public.saved_startups ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved startups
CREATE POLICY "Users can view their own saved startups"
ON public.saved_startups
FOR SELECT
USING (auth.uid() = user_id);

-- Users can save startups
CREATE POLICY "Users can save startups"
ON public.saved_startups
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unsave startups
CREATE POLICY "Users can unsave startups"
ON public.saved_startups
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for startups updated_at
CREATE TRIGGER update_startups_updated_at
BEFORE UPDATE ON public.startups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert some sample startups for testing
INSERT INTO public.startups (user_id, name, logo, domain, stage, funding, description, tags)
SELECT 
  (SELECT id FROM public.profiles WHERE role = 'founder' LIMIT 1),
  'TechFlow AI',
  '🤖',
  'AI/ML',
  'Series A',
  '$500K',
  'AI-powered project management platform with predictive analytics and smart automation for modern teams.',
  ARRAY['AI', 'SaaS', 'Productivity']
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE role = 'founder' LIMIT 1);

INSERT INTO public.startups (user_id, name, logo, domain, stage, funding, description, tags)
SELECT 
  (SELECT id FROM public.profiles WHERE role = 'founder' LIMIT 1),
  'HealthSync',
  '🏥',
  'HealthTech',
  'Series B',
  '$1M',
  'Revolutionary telemedicine platform connecting patients with specialists through AI-powered diagnosis.',
  ARRAY['HealthTech', 'Telemedicine', 'AI']
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE role = 'founder' LIMIT 1);

INSERT INTO public.startups (user_id, name, logo, domain, stage, funding, description, tags)
SELECT 
  (SELECT id FROM public.profiles WHERE role = 'founder' LIMIT 1),
  'GreenEnergy Solutions',
  '🌱',
  'CleanTech',
  'Seed',
  '$750K',
  'Sustainable energy solutions for residential and commercial properties with smart monitoring.',
  ARRAY['CleanTech', 'Energy', 'IoT']
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE role = 'founder' LIMIT 1);

INSERT INTO public.startups (user_id, name, logo, domain, stage, funding, description, tags)
SELECT 
  (SELECT id FROM public.profiles WHERE role = 'founder' LIMIT 1),
  'FinTrack Pro',
  '💰',
  'FinTech',
  'Series A',
  '$2M',
  'Next-generation financial tracking and investment platform for modern investors.',
  ARRAY['FinTech', 'Investment', 'SaaS']
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE role = 'founder' LIMIT 1);

INSERT INTO public.startups (user_id, name, logo, domain, stage, funding, description, tags)
SELECT 
  (SELECT id FROM public.profiles WHERE role = 'founder' LIMIT 1),
  'EduLearn AI',
  '📚',
  'EdTech',
  'Seed',
  '$300K',
  'Personalized learning platform powered by AI that adapts to each student learning style.',
  ARRAY['EdTech', 'AI', 'Learning']
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE role = 'founder' LIMIT 1);

INSERT INTO public.startups (user_id, name, logo, domain, stage, funding, description, tags)
SELECT 
  (SELECT id FROM public.profiles WHERE role = 'founder' LIMIT 1),
  'FoodHub Connect',
  '🍔',
  'FoodTech',
  'Pre-Seed',
  '$150K',
  'Connecting local food producers with restaurants through an intelligent supply chain platform.',
  ARRAY['FoodTech', 'Marketplace', 'Logistics']
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE role = 'founder' LIMIT 1);