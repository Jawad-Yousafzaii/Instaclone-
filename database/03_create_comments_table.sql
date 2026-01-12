-- =============================================
-- File: 03_create_comments_table.sql
-- Description: Create comments table for media comments
-- Run Order: 3
-- =============================================

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Comment content
    content TEXT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_comments_media_id ON public.comments(media_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to update media comments_count
CREATE OR REPLACE FUNCTION public.update_media_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.media 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.media_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.media 
        SET comments_count = GREATEST(comments_count - 1, 0)
        WHERE id = OLD.media_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comments_count_on_insert
    AFTER INSERT ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_media_comments_count();

CREATE TRIGGER update_comments_count_on_delete
    AFTER DELETE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_media_comments_count();

-- Comments
COMMENT ON TABLE public.comments IS 'Comments on media content';
