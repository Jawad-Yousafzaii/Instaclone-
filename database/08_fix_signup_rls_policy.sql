-- =============================================
-- QUICK FIX: Run this in Supabase SQL Editor
-- This fixes the RLS policy to allow signup
-- =============================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Create new policy that works for authenticated users during signup
CREATE POLICY "Enable insert for authenticated users"
    ON public.users 
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Verify it worked
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd 
FROM pg_policies 
WHERE tablename = 'users' AND cmd = 'INSERT';
