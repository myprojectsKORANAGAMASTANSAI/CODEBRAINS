-- ==============================================================================
-- CODE BRAINS — Supabase Cloud Database & Storage Schema
-- ==============================================================================
-- This script creates the PostgreSQL tables and Storage configurations for the
-- Universal Cloud Database. Run this script in your Supabase Dashboard -> SQL Editor.
-- ==============================================================================

-- 1. Create Folders Table
CREATE TABLE IF NOT EXISTS public.cb_folders (
    id TEXT PRIMARY KEY,
    parent_id TEXT DEFAULT 'root',
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Index for folder navigation & hierarchy
CREATE INDEX IF NOT EXISTS idx_cb_folders_parent ON public.cb_folders(parent_id);

-- 2. Create Files Table
CREATE TABLE IF NOT EXISTS public.cb_files (
    id TEXT PRIMARY KEY,
    folder_id TEXT DEFAULT 'root' REFERENCES public.cb_folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'code',
    size TEXT,
    storage_path TEXT,
    mime_type TEXT,
    url TEXT,
    date TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Index for files per folder
CREATE INDEX IF NOT EXISTS idx_cb_files_folder ON public.cb_files(folder_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.cb_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cb_files ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Application Access
DROP POLICY IF EXISTS "Allow public read access on cb_folders" ON public.cb_folders;
CREATE POLICY "Allow public read access on cb_folders" 
ON public.cb_folders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on cb_folders" ON public.cb_folders;
CREATE POLICY "Allow public insert on cb_folders" 
ON public.cb_folders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on cb_folders" ON public.cb_folders;
CREATE POLICY "Allow public update on cb_folders" 
ON public.cb_folders FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on cb_folders" ON public.cb_folders;
CREATE POLICY "Allow public delete on cb_folders" 
ON public.cb_folders FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read access on cb_files" ON public.cb_files;
CREATE POLICY "Allow public read access on cb_files" 
ON public.cb_files FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on cb_files" ON public.cb_files;
CREATE POLICY "Allow public insert on cb_files" 
ON public.cb_files FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on cb_files" ON public.cb_files;
CREATE POLICY "Allow public update on cb_files" 
ON public.cb_files FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on cb_files" ON public.cb_files;
CREATE POLICY "Allow public delete on cb_files" 
ON public.cb_files FOR DELETE USING (true);

-- 5. Enable Realtime Publications
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'cb_folders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.cb_folders;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'cb_files'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.cb_files;
    END IF;
END $$;

-- 6. Storage Bucket Configuration for 'files'
-- Creates the public storage bucket named 'files' if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('files', 'files', true, 52428800, NULL)
ON CONFLICT (id) DO UPDATE 
SET public = true, file_size_limit = 52428800;

-- 7. Storage RLS Policies
DROP POLICY IF EXISTS "Allow public read on files bucket" ON storage.objects;
CREATE POLICY "Allow public read on files bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'files');

DROP POLICY IF EXISTS "Allow public insert on files bucket" ON storage.objects;
CREATE POLICY "Allow public insert on files bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'files');

DROP POLICY IF EXISTS "Allow public update on files bucket" ON storage.objects;
CREATE POLICY "Allow public update on files bucket" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'files')
WITH CHECK (bucket_id = 'files');

DROP POLICY IF EXISTS "Allow public delete on files bucket" ON storage.objects;
CREATE POLICY "Allow public delete on files bucket" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'files');
