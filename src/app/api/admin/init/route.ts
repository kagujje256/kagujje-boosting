import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dtejfdquiqogwapjtfar.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZWpmZHF1aXFvZ3dhcGp0ZmFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ2Njk4MCwiZXhwIjoyMDkyMDQyOTgwfQ.tiq8drt1WuBrKv3OMgf6lo8IiJUFqferwnGGWSJksM',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Services with UGX pricing
const DEFAULT_SERVICES = [
  // Instagram
  { name: 'Instagram Followers [HQ]', slug: 'ig-followers-hq', category: 'instagram', description: 'Real followers with profile pictures. 10-30K/day. Refill 30 days.', min_order: 100, max_order: 100000, price_per_unit: 1.8, quality: 'High Quality', speed: 'Fast', featured: true },
  { name: 'Instagram Likes [Instant]', slug: 'ig-likes', category: 'instagram', description: 'Instant likes from real accounts', min_order: 100, max_order: 50000, price_per_unit: 0.9, quality: 'High Quality', speed: 'Instant' },
  { name: 'Instagram Views', slug: 'ig-views', category: 'instagram', description: 'High retention video views', min_order: 500, max_order: 100000, price_per_unit: 0.36, quality: 'Standard', speed: 'Fast' },
  { name: 'Instagram Comments', slug: 'ig-comments', category: 'instagram', description: 'Custom comments from real accounts', min_order: 10, max_order: 1000, price_per_unit: 180, quality: 'High Quality', speed: 'Medium' },
  
  // TikTok
  { name: 'TikTok Followers', slug: 'tt-followers', category: 'tiktok', description: 'Real followers with engagement', min_order: 100, max_order: 50000, price_per_unit: 2.7, quality: 'High Quality', speed: 'Fast', featured: true },
  { name: 'TikTok Views [Viral]', slug: 'tt-views', category: 'tiktok', description: 'High retention views. Boost your reach!', min_order: 1000, max_order: 1000000, price_per_unit: 0.18, quality: 'High Quality', speed: 'Instant' },
  { name: 'TikTok Likes', slug: 'tt-likes', category: 'tiktok', description: 'Instant likes from real accounts', min_order: 100, max_order: 100000, price_per_unit: 1.08, quality: 'Standard', speed: 'Instant' },
  
  // YouTube
  { name: 'YouTube Views [HR]', slug: 'yt-views', category: 'youtube', description: 'High retention views (30sec-2min watch)', min_order: 1000, max_order: 1000000, price_per_unit: 2.7, quality: 'High Quality', speed: 'Medium', featured: true },
  { name: 'YouTube Subscribers', slug: 'yt-subs', category: 'youtube', description: 'Real subscribers with profile pictures', min_order: 100, max_order: 10000, price_per_unit: 270, quality: 'High Quality', speed: 'Slow' },
  { name: 'YouTube Likes', slug: 'yt-likes', category: 'youtube', description: 'Instant video likes', min_order: 100, max_order: 50000, price_per_unit: 3.6, quality: 'Standard', speed: 'Instant' },
  
  // Twitter
  { name: 'Twitter Followers', slug: 'tw-followers', category: 'twitter', description: 'Real followers with tweets', min_order: 100, max_order: 50000, price_per_unit: 3.6, quality: 'High Quality', speed: 'Fast' },
  { name: 'Twitter Likes', slug: 'tw-likes', category: 'twitter', description: 'Instant tweet likes', min_order: 100, max_order: 50000, price_per_unit: 1.8, quality: 'Standard', speed: 'Instant' },
  
  // Facebook
  { name: 'Facebook Page Likes', slug: 'fb-likes', category: 'facebook', description: 'Real page likes from active accounts', min_order: 100, max_order: 50000, price_per_unit: 4.5, quality: 'High Quality', speed: 'Medium' },
  
  // Telegram
  { name: 'Telegram Members', slug: 'tg-members', category: 'telegram', description: 'Real group/channel members', min_order: 100, max_order: 50000, price_per_unit: 5.4, quality: 'High Quality', speed: 'Fast', featured: true },
  
  // Spotify
  { name: 'Spotify Plays', slug: 'sp-plays', category: 'spotify', description: 'Real plays from premium accounts', min_order: 1000, max_order: 1000000, price_per_unit: 0.9, quality: 'High Quality', speed: 'Medium' },
  
  // WhatsApp
  { name: 'WhatsApp Group Members', slug: 'wa-members', category: 'whatsapp', description: 'Real WhatsApp group members (Uganda focused)', min_order: 50, max_order: 1000, price_per_unit: 1800, quality: 'High Quality', speed: 'Slow' },
];

const DEFAULT_CATEGORIES = [
  { name: 'Instagram', slug: 'instagram', icon: 'instagram', display_order: 1 },
  { name: 'TikTok', slug: 'tiktok', icon: 'tiktok', display_order: 2 },
  { name: 'YouTube', slug: 'youtube', icon: 'youtube', display_order: 3 },
  { name: 'Twitter', slug: 'twitter', icon: 'twitter', display_order: 4 },
  { name: 'Facebook', slug: 'facebook', icon: 'facebook', display_order: 5 },
  { name: 'Telegram', slug: 'telegram', icon: 'telegram', display_order: 6 },
  { name: 'Spotify', slug: 'spotify', icon: 'spotify', display_order: 7 },
  { name: 'WhatsApp', slug: 'whatsapp', icon: 'whatsapp', display_order: 8 },
];

const DEFAULT_SETTINGS = [
  { key: 'site_name', value: 'KAGUJJE Boost', description: 'Site name' },
  { key: 'site_tagline', value: "Uganda's #1 SMM Panel", description: 'Site tagline' },
  { key: 'default_currency', value: 'UGX', description: 'Default currency (Ugandan Shilling)' },
  { key: 'default_profit_percent', value: '80', description: 'Default profit percentage' },
  { key: 'min_deposit', value: '5000', description: 'Minimum deposit amount in UGX' },
  { key: 'mrgoviral_api_key', value: '', description: 'mrgoviral.com API key' },
  { key: 'mrgoviral_api_url', value: 'https://mrgoviral.com/api/v2', description: 'mrgoviral API endpoint' },
  { key: 'marzpay_api_key', value: '', description: 'MarzPay API Key for deposits' },
  { key: 'marzpay_api_secret', value: '', description: 'MarzPay API Secret' },
  { key: 'marzpay_merchant_id', value: '', description: 'MarzPay Merchant ID' },
  { key: 'support_email', value: 'dicksonkagujje@gmail.com', description: 'Support email' },
  { key: 'support_whatsapp', value: 'https://wa.me/256700000000', description: 'WhatsApp support link' },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action') || 'status';
    
    if (action === 'init') {
      // Initialize all default data
      console.log('=== INITIALIZING DEFAULT DATA ===');
      
      // 1. Add categories
      console.log('Adding categories...');
      for (const cat of DEFAULT_CATEGORIES) {
        const { error } = await supabaseAdmin
          .from('categories')
          .upsert({ ...cat, is_visible: true }, { onConflict: 'slug' });
        if (error) console.log(`Category error ${cat.name}: ${error.message}`);
      }
      
      // Get category IDs
      const { data: categories } = await supabaseAdmin.from('categories').select('id, slug');
      const categoryMap = new Map(categories?.map(c => [c.slug, c.id]) || []);
      
      // 2. Add services
      console.log('Adding services...');
      for (const service of DEFAULT_SERVICES) {
        const categoryId = categoryMap.get(service.category);
        if (!categoryId) continue;
        
        const { error } = await supabaseAdmin
          .from('services')
          .upsert({
            name: service.name,
            slug: service.slug,
            category_id: categoryId,
            description: service.description,
            min_order: service.min_order,
            max_order: service.max_order,
            price_per_unit: service.price_per_unit,
            currency: 'UGX',
            unit: 'per unit',
            is_visible: true,
            is_featured: service.featured || false,
            quality: service.quality,
            speed: service.speed,
          }, { onConflict: 'slug' });
        
        if (error) {
          console.log(`Service error ${service.name}: ${error.message}`);
        }
      }
      
      // 3. Add settings
      console.log('Adding settings...');
      for (const setting of DEFAULT_SETTINGS) {
        await supabaseAdmin
          .from('settings')
          .upsert(setting, { onConflict: 'key' });
      }
      
      // 4. Add provider config
      await supabaseAdmin
        .from('provider_configs')
        .upsert({
          id: 'mrgoviral',
          name: 'mrgoviral',
          api_url: 'https://mrgoviral.com/api/v2',
          api_key: 'PLACEHOLDER',
          is_active: false,
        }, { onConflict: 'id' });
      
      // Get counts
      const { count: serviceCount } = await supabaseAdmin.from('services').select('*', { count: 'exact', head: true });
      const { count: categoryCount } = await supabaseAdmin.from('categories').select('*', { count: 'exact', head: true });
      const { count: settingsCount } = await supabaseAdmin.from('settings').select('*', { count: 'exact', head: true });
      
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully!',
        counts: {
          categories: categoryCount || 0,
          services: serviceCount || 0,
          settings: settingsCount || 0,
        },
      });
    }
    
    // Default: return status
    const { count: serviceCount } = await supabaseAdmin.from('services').select('*', { count: 'exact', head: true });
    const { count: categoryCount } = await supabaseAdmin.from('categories').select('*', { count: 'exact', head: true });
    const { count: userCount } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      success: true,
      status: 'operational',
      counts: {
        categories: categoryCount || 0,
        services: serviceCount || 0,
        users: userCount || 0,
      },
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
