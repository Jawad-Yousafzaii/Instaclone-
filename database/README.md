# Database Migration Files

## Overview
These SQL files set up the complete database schema for the MediaShare application using Supabase (PostgreSQL).

## Execution Order

Run these files **in numerical order** in the Supabase SQL Editor:

### 1. `01_create_users_table.sql`
- Creates the `users` table for user profiles
- Sets up auto-update triggers for `updated_at`
- Enables Row Level Security (RLS)

### 2. `02_create_media_table.sql`
- Creates the `media` table for photo/video metadata
- Stores Azure Blob Storage URLs
- Includes full-text search indexes
- Sets up performance indexes

### 3. `03_create_comments_table.sql`
- Creates the `comments` table
- Auto-updates media `comments_count` via triggers
- Enables RLS

### 4. `04_create_ratings_table.sql`
- Creates the `ratings` table (1-5 stars)
- Auto-calculates media `average_rating` via triggers
- Prevents duplicate ratings per user/media

### 5. `05_enable_rls_policies.sql`
- Sets up Row Level Security policies for all tables
- Defines who can read/write/update/delete data
- **Important**: Ensures data protection

### 6. `06_create_helper_functions.sql`
- Creates database functions for common queries
- Includes search and filtering capabilities
- Creator media queries

### 7. `07_create_storage_setup.sql`
- Optional tracking table for Azure uploads
- Audit trail for blob storage
- Environment variable reminders

## How to Run

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project
3. Click **SQL Editor** in the sidebar
4. Create a new query
5. Copy and paste the contents of file `01_create_users_table.sql`
6. Click **Run** or press `Ctrl+Enter`
7. Repeat for files `02` through `07` **in order**

## Verification

After running all migrations, verify the setup:

```sql
-- Check all tables exist
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true;

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';
```

## Azure Storage Integration

The database stores **metadata only**. Actual media files are stored in Azure Blob Storage.

### Setup Required:
1. Create an Azure Storage Account
2. Create a container named `media-uploads`
3. Generate a SAS token for secure access
4. Add credentials to your frontend `.env` file

See `database/azure-integration-guide.md` for detailed setup instructions.

## Troubleshooting

### Error: "relation already exists"
- The table was already created. Check if you ran the file twice.
- You can drop the table and re-run, or skip to the next file.

### Error: "permission denied"
- Make sure you're running as the Supabase owner
- Check RLS policies aren't blocking your access

### Error: "function does not exist"
- Run files in order! Later files depend on earlier ones.
