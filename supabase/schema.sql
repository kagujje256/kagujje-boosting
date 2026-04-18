-- ============================================
-- KAGUJJE Boosting - Supabase Database Schema
-- SMM Panel with Social Auth
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  balance DECIMAL(12,2) DEFAULT 0.00,
  spent DECIMAL(12,2) DEFAULT 0.00,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'reseller')),
  referral_code TEXT UNIQUE DEFAULT uuid_generate_v4()::text,
  referred_by UUID REFERENCES profiles(id),
  discount_percentage INTEGER DEFAULT 0,
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  min_order INTEGER DEFAULT 1,
  max_order INTEGER DEFAULT 100000,
  price_per_unit DECIMAL(10,4) NOT NULL,
  original_price DECIMAL(10,4),
  provider TEXT,
  provider_service_id TEXT,
  refill BOOLEAN DEFAULT false,
  refill_days INTEGER DEFAULT 0,
  speed TEXT DEFAULT 'Normal',
  quality TEXT DEFAULT 'Standard',
  average_time TEXT,
  is_visible BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL NOT NULL,
  link TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  start_count INTEGER,
  remains INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'in_progress', 'completed', 'partial', 'cancelled', 'refunded')),
  provider_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'order', 'refund', 'bonus', 'referral')),
  amount DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2),
  reference TEXT,
  payment_method TEXT,
  payment_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket Messages
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  commission DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- API Keys for external providers
CREATE TABLE IF NOT EXISTS provider_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  api_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed initial data
INSERT INTO categories (name, slug, icon, display_order) VALUES
  ('Instagram', 'instagram', 'instagram', 1),
  ('TikTok', 'tiktok', 'tiktok', 2),
  ('YouTube', 'youtube', 'youtube', 3),
  ('Twitter / X', 'twitter', 'twitter', 4),
  ('Facebook', 'facebook', 'facebook', 5),
  ('Telegram', 'telegram', 'telegram', 6),
  ('Spotify', 'spotify', 'spotify', 7),
  ('WhatsApp', 'whatsapp', 'whatsapp', 8)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (name, slug, category_id, description, min_order, max_order, price_per_unit, is_featured) 
SELECT 
  'Instagram Followers [High Quality]',
  'instagram-followers-hq',
  id,
  'Real followers with profile pictures. 10-30K/day speed. Refill 30 days.',
  100,
  100000,
  0.50,
  true
FROM categories WHERE slug = 'instagram'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
  ('site_name', 'KAGUJJE Boosting', 'Site name'),
  ('site_tagline', 'Uganda''s #1 SMM Panel', 'Site tagline'),
  ('min_deposit', '5', 'Minimum deposit amount'),
  ('referral_bonus', '5', 'Referral bonus percentage'),
  ('marzpay_api_key', '', 'MarzPay API Key'),
  ('marzpay_api_secret', '', 'MarzPay API Secret')
ON CONFLICT (key) DO NOTHING;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all orders" ON orders USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all transactions" ON transactions USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Public read for categories and services
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);
CREATE POLICY "Services are public" ON services FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can manage services" ON services USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
