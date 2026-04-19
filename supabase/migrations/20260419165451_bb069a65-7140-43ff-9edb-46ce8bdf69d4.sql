-- Create table for free trial signups
CREATE TABLE public.free_trial_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  brand_website TEXT,
  social_facebook TEXT,
  social_instagram TEXT,
  social_other TEXT,
  video_quantity INTEGER NOT NULL DEFAULT 0,
  static_quantity INTEGER NOT NULL DEFAULT 0,
  frequency TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.free_trial_signups ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can submit a signup
CREATE POLICY "Anyone can submit a free trial signup"
ON public.free_trial_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No public read access — submissions are private
-- (Project owner can view via the Cloud database UI)