-- =============================================
-- File: 07_create_storage_setup.sql
-- Description: Setup for Azure Storage integration
-- Run Order: 7
-- Note: This file contains placeholder tables for tracking Azure uploads
-- =============================================

-- Create table to track Azure blob uploads (optional, for auditing)
CREATE TABLE IF NOT EXISTS public.azure_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID REFERENCES public.media(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Azure Storage details
    container_name TEXT NOT NULL,
    blob_name TEXT NOT NULL,
    blob_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    content_type TEXT,
    
    -- Status
    upload_status TEXT NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending', 'completed', 'failed')),
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_azure_uploads_media_id ON public.azure_uploads(media_id);
CREATE INDEX IF NOT EXISTS idx_azure_uploads_user_id ON public.azure_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_azure_uploads_status ON public.azure_uploads(upload_status);

-- Enable RLS
ALTER TABLE public.azure_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own uploads"
    ON public.azure_uploads FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploads"
    ON public.azure_uploads FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE public.azure_uploads IS 'Tracks Azure Blob Storage uploads for auditing';
COMMENT ON COLUMN public.azure_uploads.blob_url IS 'Full Azure Blob Storage URL';

-- ========================================
-- ENVIRONMENT VARIABLES REMINDER
-- ========================================
-- Make sure to set these in your .env file:
-- VITE_AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
-- VITE_AZURE_STORAGE_CONTAINER_NAME=media-uploads
-- VITE_AZURE_STORAGE_SAS_TOKEN=your_sas_token
--
-- Or use Azure Storage connection string:
-- AZURE_STORAGE_CONNECTION_STRING=your_connection_string
