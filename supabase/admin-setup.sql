-- =====================================
-- KAGUJJE Boosting - Admin Setup
-- Run this in Supabase SQL Editor
-- =====================================

-- First, let's see all users and their profiles
SELECT 
  u.id, 
  u.email, 
  u.raw_user_meta_data->>'username' as username,
  p.role,
  p.balance
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email LIKE '%kaggu%' OR u.raw_user_meta_data->>'username' = 'kaggu';

-- Update the kaggu user to admin role
-- This finds the user by username in metadata and updates their profile
INSERT INTO profiles (id, username, full_name, role, balance, spent)
SELECT 
  id,
  raw_user_meta_data->>'username',
  'Kaggu Admin',
  'admin',
  0,
  0
FROM auth.users
WHERE raw_user_meta_data->>'username' = 'kaggu'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  full_name = 'Kaggu Admin';

-- Verify the update
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.role,
  p.balance,
  u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.username = 'kaggu' OR p.role = 'admin';

-- Enable RLS bypass for service operations (if needed)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admin to manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow profile creation on signup
CREATE POLICY "Users can create own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO anon;

-- Create the trigger function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role, balance, spent)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    'user',
    0,
    0
  );
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
