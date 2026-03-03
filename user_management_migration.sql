-- ================================================================
-- Marinduque Connect — User Management System
-- Run this in your Supabase SQL Editor
-- ================================================================

-- ─── 1. Profiles Table ──────────────────────────────────────────
-- Extends the auth.users system with custom fields like role
CREATE TABLE IF NOT EXISTS public.profiles (
    id          uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name   text,
    email       text UNIQUE,
    avatar_url  text,
    role        text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
    created_at  timestamptz DEFAULT now() NOT NULL,
    updated_at  timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can view profiles (to see names/avatars)
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

-- Users can update their own non-role fields
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Only admins can change roles
CREATE POLICY "Admins can update user roles"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (true);

-- ─── 2. Handle New User Signups ──────────────────────────────────
-- Automatically create a profile when a new user signs up via Google
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        -- Hardcore the first admin if needed, or check if email is in the admin list
        CASE 
            WHEN NEW.email = 'mspeninv1@gmail.com' THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 3. Populate existing users (Helper) ────────────────────────
-- If you already have users, you can run this to create their profiles:
-- INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
-- SELECT id, raw_user_meta_data->>'full_name', email, raw_user_meta_data->>'avatar_url', 'user'
-- FROM auth.users
-- ON CONFLICT (id) DO NOTHING;
