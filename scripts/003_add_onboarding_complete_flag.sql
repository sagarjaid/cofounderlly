-- Add onboarding_complete flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN onboarding_complete BOOLEAN DEFAULT false;

-- Update existing profiles to set onboarding_complete based on required fields
UPDATE public.profiles 
SET onboarding_complete = (
  founder_type IS NOT NULL 
  AND bio IS NOT NULL 
  AND location IS NOT NULL 
  AND timezone IS NOT NULL 
  AND weekly_hours IS NOT NULL 
  AND has_idea IS NOT NULL 
  AND calendar_url IS NOT NULL 
  AND looking_for IS NOT NULL 
  AND array_length(looking_for, 1) > 0
);

-- Update the handle_new_user function to set onboarding_complete to false for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    linkedin_url,
    avatar_url,
    member_since,
    onboarding_complete
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'linkedin_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    TO_CHAR(NOW(), 'Month YYYY'),
    false  -- New users haven't completed onboarding
  );
  RETURN NEW;
END;
$$;
