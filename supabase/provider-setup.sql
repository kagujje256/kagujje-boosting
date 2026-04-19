-- ============================================
-- KAGUJJE Boosting - Provider & Services Setup
-- mrgoviral.com Integration with 80% Profit
-- ============================================

-- 1. Add Profit Settings
INSERT INTO settings (key, value, description) VALUES
  ('profit_percentage', '80', 'Default profit margin percentage (customizable per service)'),
  ('currency', 'USD', 'Default currency for pricing'),
  ('provider', 'mrgoviral', 'Default provider name'),
  ('provider_api_url', 'https://mrgoviral.com/api/v2', 'Provider API URL')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Add Provider Configuration (API key needed - replace YOUR_API_KEY)
-- Run this AFTER you add your API key
-- INSERT INTO provider_configs (name, api_url, api_key, is_active)
-- VALUES ('mrgoviral', 'https://mrgoviral.com/api/v2', 'YOUR_API_KEY', true);

-- 3. Update services table to add profit columns if not exists
ALTER TABLE services ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,4) DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS profit_percent INTEGER DEFAULT 80;
ALTER TABLE services ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES provider_configs(id);
ALTER TABLE services ADD COLUMN IF NOT EXISTS external_service_id TEXT;

-- 4. Add sample services with 80% profit markup
-- These are example prices - real prices come from mrgoviral API

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'Instagram Followers [Real & Active]',
  'ig-followers-real',
  id,
  'Real followers from active accounts. 5-10K/day. Refill 30 days. Start 0-1hr.',
  100,
  100000,
  0.90,  -- Sell price (80% markup)
  0.50,  -- Cost price
  80,    -- Profit percentage
  true,
  true,
  1
FROM categories WHERE slug = 'instagram'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'Instagram Likes [Instant]',
  'ig-likes-instant',
  id,
  'Instant likes from real accounts. Start 0-5min. Refill 30 days.',
  50,
  50000,
  0.18,  -- Sell price
  0.10,  -- Cost price
  80,    -- 80% profit
  true,
  true,
  2
FROM categories WHERE slug = 'instagram'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'TikTok Followers [High Quality]',
  'tt-followers-hq',
  id,
  'High quality TikTok followers. 5-20K/day. Start 0-1hr. Refill 30 days.',
  100,
  100000,
  0.72,  -- Sell price
  0.40,  -- Cost price  
  80,    -- 80% profit
  true,
  true,
  1
FROM categories WHERE slug = 'tiktok'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'TikTok Views [Instant]',
  'tt-views-instant',
  id,
  'Instant TikTok views. Start 0-5min. Up to 1M views.',
  500,
  1000000,
  0.009,  -- Sell price ($9 per 1K)
  0.005,  -- Cost price
  80,     -- 80% profit
  true,
  true,
  2
FROM categories WHERE slug = 'tiktok'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'YouTube Views [Real]',
  'yt-views-real',
  id,
  'Real YouTube views. 1-5K/day. Watch time 30+ seconds. Refill 30 days.',
  500,
  1000000,
  0.72,  -- Sell price
  0.40,  -- Cost price
  80,    -- 80% profit
  true,
  true,
  1
FROM categories WHERE slug = 'youtube'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'YouTube Subscribers [Real]',
  'yt-subs-real',
  id,
  'Real YouTube subscribers. 100-500/day. Refill 30 days. Lifetime warranty.',
  50,
  50000,
  2.70,  -- Sell price
  1.50,  -- Cost price
  80,    -- 80% profit
  true,
  true,
  2
FROM categories WHERE slug = 'youtube'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'Twitter Followers [Real]',
  'tw-followers-real',
  id,
  'Real Twitter/X followers. 100-500/day. Refill 30 days.',
  100,
  50000,
  0.90,  -- Sell price
  0.50,  -- Cost price
  80,    -- 80% profit
  true,
  true,
  1
FROM categories WHERE slug = 'twitter'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'Facebook Page Likes',
  'fb-likes-page',
  id,
  'Real Facebook page likes. 100-500/day. Refill 30 days.',
  100,
  50000,
  0.90,  -- Sell price
  0.50,  -- Cost price
  80,    -- 80% profit
  true,
  true,
  1
FROM categories WHERE slug = 'facebook'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'Telegram Members [Real]',
  'tg-members-real',
  id,
  'Real Telegram group/channel members. 100-1K/day. Refill 30 days.',
  100,
  50000,
  0.90,  -- Sell price
  0.50,  -- Cost price
  80,    -- 80% profit
  true,
  true,
  1
FROM categories WHERE slug = 'telegram'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, cost_price, profit_percent, is_featured, is_visible, display_order)
SELECT 
  'Spotify Plays [Real]',
  'sp-plays-real',
  id,
  'Real Spotify plays. Premium quality. 1-5K/day. Refill 30 days.',
  500,
  1000000,
  0.27,  -- Sell price
  0.15,  -- Cost price
  80,    -- 80% profit
  true,
  true,
  1
FROM categories WHERE slug = 'spotify'
ON CONFLICT (slug) DO UPDATE SET 
  price_per_unit = EXCLUDED.price_per_unit,
  cost_price = EXCLUDED.cost_price,
  profit_percent = EXCLUDED.profit_percent;

-- 5. Add RLS policy for provider_configs
ALTER TABLE provider_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage provider_configs" ON provider_configs USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. Add RLS for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are readable by all" ON settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON settings USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Success message
SELECT '✅ Provider & Services Setup Complete!' as status;
SELECT '⚠️ Add your mrgoviral API key in provider_configs table' as next_step;
SELECT '📊 Profit margin set to 80% (customizable per service)' as profit;
