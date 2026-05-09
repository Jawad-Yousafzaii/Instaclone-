-- =============================================
-- File: 06_create_helper_functions.sql
-- Description: Helper functions for queries and operations
-- Run Order: 6
-- =============================================

-- Function to increment media views
CREATE OR REPLACE FUNCTION public.increment_media_views(media_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.media
        SET views_count = coalesce(views_count, 0) + 1
    WHERE id = media_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get media with creator info
CREATE OR REPLACE FUNCTION public.get_media_with_creator(
    limit_count INTEGER DEFAULT 12,
    offset_count INTEGER DEFAULT 0,
    search_query TEXT DEFAULT NULL,
    filter_location TEXT DEFAULT NULL,
    sort_by TEXT DEFAULT 'newest'
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    caption TEXT,
    type TEXT,
    url TEXT,
    thumbnail_url TEXT,
    location TEXT,
    people TEXT[],
    views_count INTEGER,
    average_rating DECIMAL,
    ratings_count INTEGER,
    comments_count INTEGER,
    created_at TIMESTAMPTZ,
    creator_id UUID,
    creator_name TEXT,
    creator_avatar TEXT,
    creator_email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.caption,
        m.type,
        m.url,
        m.thumbnail_url,
        m.location,
        m.people,
        m.views_count,
        m.average_rating,
        m.ratings_count,
        m.comments_count,
        m.created_at,
        u.id as creator_id,
        u.name as creator_name,
        u.avatar_url as creator_avatar,
        u.email as creator_email
    FROM public.media m
    INNER JOIN public.users u ON m.creator_id = u.id
    WHERE 
        (search_query IS NULL OR 
         to_tsvector('english', m.title || ' ' || m.caption) @@ plainto_tsquery('english', search_query))
        AND
        (filter_location IS NULL OR m.location ILIKE '%' || filter_location || '%')
    ORDER BY
        CASE 
            WHEN sort_by = 'newest' THEN m.created_at
            ELSE NULL
        END DESC,
        CASE 
            WHEN sort_by = 'oldest' THEN m.created_at
            ELSE NULL
        END ASC,
        CASE 
            WHEN sort_by = 'popular' THEN m.views_count
            ELSE NULL
        END DESC,
        CASE 
            WHEN sort_by = 'highest-rated' THEN m.average_rating
            ELSE NULL
        END DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get media by creator
CREATE OR REPLACE FUNCTION public.get_creator_media(creator_uuid UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    caption TEXT,
    type TEXT,
    url TEXT,
    thumbnail_url TEXT,
    location TEXT,
    people TEXT[],
    views_count INTEGER,
    average_rating DECIMAL,
    ratings_count INTEGER,
    comments_count INTEGER,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.caption,
        m.type,
        m.url,
        m.thumbnail_url,
        m.location,
        m.people,
        m.views_count,
        m.average_rating,
        m.ratings_count,
        m.comments_count,
        m.created_at
    FROM public.media m
    WHERE m.creator_id = creator_uuid
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON FUNCTION public.increment_media_views IS 'Safely increment view count for a media item';
COMMENT ON FUNCTION public.get_media_with_creator IS 'Get media with creator info, supports search and filtering';
COMMENT ON FUNCTION public.get_creator_media IS 'Get all media by a specific creator';
