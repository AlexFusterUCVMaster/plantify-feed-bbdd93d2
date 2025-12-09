-- Alter posts table to store username and avatar directly (denormalized for flexibility)
-- This allows demo posts without requiring auth users
ALTER TABLE public.posts 
ADD COLUMN username TEXT,
ADD COLUMN user_avatar TEXT,
ADD COLUMN is_verified BOOLEAN DEFAULT false;

-- Make user_id nullable to support demo/anonymous posts
ALTER TABLE public.posts 
ALTER COLUMN user_id DROP NOT NULL;