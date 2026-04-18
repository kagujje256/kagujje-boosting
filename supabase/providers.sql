-- ============================================
-- KAGUJJE Boosting - Providers Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  api_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  balance DECIMAL(10,4) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  priority INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add provider_id to services
ALTER TABLE services ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES providers(id);
ALTER TABLE services ADD COLUMN IF NOT EXISTS external_service_id TEXT;

-- Add provider_id to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES providers(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS external_order_id TEXT;

-- Insert mrgoviral as first provider
INSERT INTO providers (name, slug, api_url, api_key, is_default, priority)
VALUES (
  'MrGoViral',
  'mrgoviral',
  'https://mrgoviral.com/api/v2',
  '3a821b733389666e0857a26011cdbc0c',
  true,
  1
) ON CONFLICT (slug) DO UPDATE SET api_key = EXCLUDED.api_key;

-- Policies
CREATE POLICY IF NOT EXISTS "Providers admin only" ON providers FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY IF NOT EXISTS "Providers read authenticated" ON providers FOR SELECT USING (auth.uid() IS NOT NULL);
