-- =============================================
-- File: 05_enable_rls_policies.sql
-- Description: Row Level Security policies for all tables
-- Run Order: 5
-- =============================================

-- ========================================
-- USERS TABLE POLICIES
-- ========================================

-- Users can read all user profiles
CREATE POLICY "Users can read all profiles"
    ON public.users FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ========================================
-- MEDIA TABLE POLICIES
-- ========================================

-- Everyone can read all media
CREATE POLICY "Anyone can read media"
    ON public.media FOR SELECT
    USING (true);

-- Creators can insert their own media
CREATE POLICY "Creators can insert own media"
    ON public.media FOR INSERT
    WITH CHECK (
        auth.uid() = creator_id AND
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'creator'
        )
    );

-- Creators can update their own media
CREATE POLICY "Creators can update own media"
    ON public.media FOR UPDATE
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- Creators can delete their own media
CREATE POLICY "Creators can delete own media"
    ON public.media FOR DELETE
    USING (auth.uid() = creator_id);

-- ========================================
-- COMMENTS TABLE POLICIES
-- ========================================

-- Everyone can read all comments
CREATE POLICY "Anyone can read comments"
    ON public.comments FOR SELECT
    USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id);

-- ========================================
-- RATINGS TABLE POLICIES
-- ========================================

-- Everyone can read all ratings
CREATE POLICY "Anyone can read ratings"
    ON public.ratings FOR SELECT
    USING (true);

-- Authenticated users can insert ratings
CREATE POLICY "Authenticated users can insert ratings"
    ON public.ratings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings"
    ON public.ratings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings"
    ON public.ratings FOR DELETE
    USING (auth.uid() = user_id);

-- ========================================
-- COMMENTS
-- ========================================
COMMENT ON POLICY "Users can read all profiles" ON public.users IS 
    'Allow all authenticated users to read user profiles';
COMMENT ON POLICY "Anyone can read media" ON public.media IS 
    'Allow everyone to browse media content';
COMMENT ON POLICY "Creators can insert own media" ON public.media IS 
    'Only creators can upload media under their own ID';
