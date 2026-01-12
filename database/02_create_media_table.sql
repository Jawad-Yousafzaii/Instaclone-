-- =============================================
-- File: 02_create_media_table.sql
-- Description: Create media table for photos and videos metadata
-- Run Order: 2
-- =============================================

-- Create media table
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Media details
    title TEXT NOT NULL,
    caption TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    
    -- Azure Storage URLs
    url TEXT NOT NULL, -- Main media URL from Azure
    thumbnail_url TEXT, -- Thumbnail URL (optional)
    
    -- Metadata
    location TEXT NOT NULL,
    people TEXT[], -- Array of people names tagged in media
    
    -- Stats
    views_count INTEGER NOT NULL DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    ratings_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_creator_id ON public.media(creator_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media(type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_average_rating ON public.media(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_media_location ON public.media(location);

-- Enable full-text search on title and caption
CREATE INDEX IF NOT EXISTS idx_media_search ON public.media 
    USING GIN (to_tsvector('english', title || ' ' || caption));

-- Enable Row Level Security
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.media
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Comments
COMMENT ON TABLE public.media IS 'Media metadata for photos and videos stored in Azure';
COMMENT ON COLUMN public.media.url IS 'Azure Blob Storage URL for the media file';
COMMENT ON COLUMN public.media.thumbnail_url IS 'Azure Blob Storage URL for thumbnail';
COMMENT ON COLUMN public.media.people IS 'Array of people names tagged in the media';
