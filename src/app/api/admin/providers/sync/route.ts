import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ProviderAPI } from '@/lib/provider-api';

// POST /api/kaggu/providers/sync - Sync services from provider
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { providerId } = await req.json();

  // Get provider
  const { data: provider, error: providerError } = await supabase
    .from('providers')
    .select('*')
    .eq('id', providerId)
    .single();

  if (providerError || !provider) {
    return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
  }

  try {
    const api = new ProviderAPI(provider);
    const services = await api.getServices();

    let added = 0;
    let updated = 0;
    let failed = 0;

    for (const svc of services) {
      // Check if category exists
      const categorySlug = svc.category?.toLowerCase().replace(/\s+/g, '-') || 'other';
      
      let { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (!category) {
        // Create category
        const { data: newCategory } = await supabase
          .from('categories')
          .insert({
            name: svc.category || 'Other',
            slug: categorySlug,
          })
          .select()
          .single();
        category = newCategory;
      }

      const pricePerUnit = parseFloat(svc.rate) / 1000; // Convert rate per 1000 to per unit

      const { error } = await supabase
        .from('services')
        .upsert({
          name: svc.name,
          slug: `${provider.slug}-${svc.service}`,
          provider_id: provider.id,
          external_service_id: String(svc.service),
          category_id: category?.id,
          description: svc.type,
          min_order: parseInt(svc.min),
          max_order: parseInt(svc.max),
          price_per_unit: pricePerUnit,
          is_active: true,
        }, { 
          onConflict: 'slug',
          ignoreDuplicates: false 
        });

      if (error) {
        if (error.code === '23505') {
          updated++;
        } else {
          failed++;
        }
      } else {
        added++;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: services.length,
        added,
        updated,
        failed,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to sync services',
      details: error.message 
    }, { status: 500 });
  }
}

// GET /api/kaggu/providers/sync - Test provider connection
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { searchParams } = new URL(req.url);
  const providerId = searchParams.get('providerId');

  if (!providerId) {
    return NextResponse.json({ error: 'Provider ID required' }, { status: 400 });
  }

  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('id', providerId)
    .single();

  if (!provider) {
    return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
  }

  try {
    const api = new ProviderAPI(provider);
    const [balance, services] = await Promise.all([
      api.getBalance(),
      api.getServices(),
    ]);

    return NextResponse.json({
      status: 'connected',
      provider: provider.name,
      balance: balance.balance,
      currency: balance.currency,
      servicesCount: services.length,
      sampleService: services[0],
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
    }, { status: 500 });
  }
}
