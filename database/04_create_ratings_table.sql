-- =============================================
-- File: 04_create_ratings_table.sql
-- Description: Create ratings table for media ratings
-- Run Order: 4
-- =============================================

-- Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Rating value (1-5)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one rating per user per media
    UNIQUE(media_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ratings_media_id ON public.ratings(media_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);

-- Enable Row Level Security
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to recalculate media average rating
CREATE OR REPLACE FUNCTION public.update_media_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    new_avg DECIMAL(3,2);
    new_count INTEGER;
BEGIN
    -- Calculate new average and count for the affected media
    SELECT 
        COALESCE(AVG(rating), 0)::DECIMAL(3,2),
        COUNT(*)
    INTO new_avg, new_count
    FROM public.ratings
    WHERE media_id = COALESCE(NEW.media_id, OLD.media_id);
    
    -- Update media table
    UPDATE public.media
    SET 
        average_rating = new_avg,
        ratings_count = new_count
    WHERE id = COALESCE(NEW.media_id, OLD.media_id);
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for rating changes
CREATE TRIGGER update_rating_stats_on_insert
    AFTER INSERT ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_media_rating_stats();

CREATE TRIGGER update_rating_stats_on_update
    AFTER UPDATE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_media_rating_stats();

CREATE TRIGGER update_rating_stats_on_delete
    AFTER DELETE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_media_rating_stats();

-- Comments
COMMENT ON TABLE public.ratings IS 'User ratings for media (1-5 stars)';
COMMENT ON COLUMN public.ratings.rating IS 'Rating value between 1 and 5';
