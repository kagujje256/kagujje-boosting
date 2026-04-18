-- ============================================
-- KAGUJJE Boosting - Fix Auth Trigger
-- ============================================

-- 1. Add email column to profiles if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- 2. Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, balance, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    0.00,
    'user'
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail signup
  RAISE LOG 'Error creating profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.services TO authenticated;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.transactions TO authenticated;

-- 6. Update RLS policies for profiles (drop existing first)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
