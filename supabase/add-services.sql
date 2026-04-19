-- =====================================
-- KAGUJJE Boosting - Fix RLS & Add Services
-- Run this in Supabase SQL Editor
-- =====================================

-- First, fix RLS policies for services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Services are public" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;

-- Create proper policies
CREATE POLICY "Services are public read" ON services 
FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can insert services" ON services 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update services" ON services 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete services" ON services 
FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Now add sample services
-- Get category IDs dynamically
DO $$
DECLARE
    instagram_id UUID;
    tiktok_id UUID;
    youtube_id UUID;
    twitter_id UUID;
    facebook_id UUID;
    telegram_id UUID;
    spotify_id UUID;
BEGIN
    SELECT id INTO instagram_id FROM categories WHERE slug = 'instagram';
    SELECT id INTO tiktok_id FROM categories WHERE slug = 'tiktok';
    SELECT id INTO youtube_id FROM categories WHERE slug = 'youtube';
    SELECT id INTO twitter_id FROM categories WHERE slug = 'twitter';
    SELECT id INTO facebook_id FROM categories WHERE slug = 'facebook';
    SELECT id INTO telegram_id FROM categories WHERE slug = 'telegram';
    SELECT id INTO spotify_id FROM categories WHERE slug = 'spotify';
    
    -- Instagram Services
    INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, is_visible, is_featured)
    VALUES 
        ('Instagram Followers [High Quality]', 'ig-followers-hq', instagram_id, 'Real followers with profile pictures. 10-30K/day speed. 30-day refill.', 100, 100000, 0.50, true, true),
        ('Instagram Followers [Real & Active]', 'ig-followers-real', instagram_id, '100% real and active followers. Very low drop rate.', 50, 20000, 1.20, true, true),
        ('Instagram Likes [Fast]', 'ig-likes-fast', instagram_id, 'Instant likes from quality accounts.', 50, 10000, 0.15, true, true),
        ('Instagram Views [Story]', 'ig-story-views', instagram_id, 'Story views from real accounts.', 100, 50000, 0.10, true, false),
        ('Instagram Comments [Custom]', 'ig-comments', instagram_id, 'Custom comments from real users.', 10, 1000, 3.00, true, false)
    ON CONFLICT (slug) DO NOTHING;
    
    -- TikTok Services
    INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, is_visible, is_featured)
    VALUES 
        ('TikTok Followers [Real]', 'tt-followers', tiktok_id, 'Real TikTok followers. Fast delivery.', 100, 100000, 0.60, true, true),
        ('TikTok Likes [Instant]', 'tt-likes', tiktok_id, 'Instant likes on your TikTok videos.', 100, 50000, 0.20, true, true),
        ('TikTok Views [Viral]', 'tt-views', tiktok_id, 'Boost your video views instantly.', 1000, 1000000, 0.01, true, true),
        ('TikTok Shares [Boost]', 'tt-shares', tiktok_id, 'Increase your video shares.', 100, 10000, 0.50, true, false)
    ON CONFLICT (slug) DO NOTHING;
    
    -- YouTube Services
    INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, is_visible, is_featured)
    VALUES 
        ('YouTube Views [Real]', 'yt-views', youtube_id, 'Real YouTube views. High retention.', 1000, 100000, 0.80, true, true),
        ('YouTube Subscribers [Real]', 'yt-subs', youtube_id, 'Real subscribers for your channel.', 50, 10000, 5.00, true, true),
        ('YouTube Likes [HQ]', 'yt-likes', youtube_id, 'High-quality likes on your videos.', 50, 10000, 1.00, true, false),
        ('YouTube Watch Hours', 'yt-watch-hours', youtube_id, 'Watch hours for monetization.', 1000, 4000, 1.50, true, false)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Twitter Services
    INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, is_visible, is_featured)
    VALUES 
        ('Twitter Followers [Real]', 'tw-followers', twitter_id, 'Real Twitter/X followers.', 100, 50000, 0.70, true, true),
        ('Twitter Likes [Fast]', 'tw-likes', twitter_id, 'Instant likes on your tweets.', 50, 10000, 0.30, true, false),
        ('Twitter Retweets [Viral]', 'tw-retweets', twitter_id, 'Boost your tweet reach.', 50, 5000, 1.00, true, false)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Facebook Services
    INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, is_visible, is_featured)
    VALUES 
        ('Facebook Page Likes', 'fb-page-likes', facebook_id, 'Real page likes from active users.', 100, 10000, 2.00, true, true),
        ('Facebook Post Likes', 'fb-post-likes', facebook_id, 'Likes on your Facebook posts.', 100, 10000, 0.50, true, false)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Telegram Services
    INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, is_visible, is_featured)
    VALUES 
        ('Telegram Members [Real]', 'tg-members', telegram_id, 'Real members for your channel/group.', 100, 50000, 1.50, true, true),
        ('Telegram Post Views', 'tg-views', telegram_id, 'Increase your post view count.', 100, 50000, 0.20, true, false)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Spotify Services
    INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, is_visible, is_featured)
    VALUES 
        ('Spotify Plays [Real]', 'sp-plays', spotify_id, 'Real Spotify plays for your tracks.', 1000, 100000, 0.50, true, true),
        ('Spotify Followers', 'sp-followers', spotify_id, 'Followers for your artist profile.', 100, 10000, 3.00, true, false)
    ON CONFLICT (slug) DO NOTHING;
END $$;

-- Verify services were added
SELECT COUNT(*) as total_services FROM services;

-- Show featured services
SELECT s.name, c.name as category, s.price_per_unit, s.min_order, s.max_order 
FROM services s 
JOIN categories c ON c.id = s.category_id 
WHERE s.is_featured = true 
ORDER BY c.display_order;
