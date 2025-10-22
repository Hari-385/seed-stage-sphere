-- Add additional pitch details fields to pitch_analyses table
ALTER TABLE pitch_analyses
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS pitch_description TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS required_amount TEXT;