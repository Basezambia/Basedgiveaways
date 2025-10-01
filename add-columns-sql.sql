-- Add event details columns to campaigns table
-- Run this in the Supabase Dashboard SQL Editor

-- Add eventDate column
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS "eventDate" timestamp with time zone;

-- Add location column  
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS "location" text;

-- Add artist column
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS "artist" text;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'campaigns' 
AND table_schema = 'public'
ORDER BY ordinal_position;