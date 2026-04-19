import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ProviderAPI, syncProviderServices } from '@/lib/provider-api';

// GET /api/kaggu/providers - List all providers
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: providers, error } = await supabase
    .from('providers')
    .select('*')
    .order('priority', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get balance for each active provider
  const providersWithBalance = await Promise.all(
    (providers || []).map(async (p) => {
      if (!p.is_active) return { ...p, balance: p.balance };
      
      try {
        const api = new ProviderAPI(p);
        const balanceData = await api.getBalance();
        return { ...p, balance: parseFloat(balanceData.balance) };
      } catch {
        return { ...p, balance: p.balance };
      }
    })
  );

  return NextResponse.json({ providers: providersWithBalance });
}

// POST /api/kaggu/providers - Add new provider
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const body = await req.json();
  const { name, slug, api_url, api_key, is_default } = body;

  const { data, error } = await supabase
    .from('providers')
    .insert({
      name,
      slug,
      api_url,
      api_key,
      is_default: is_default || false,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ provider: data });
}

// PUT /api/kaggu/providers - Update provider
export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const body = await req.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from('providers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ provider: data });
}

// DELETE /api/kaggu/providers - Delete provider
export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { id } = await req.json();

  const { error } = await supabase
    .from('providers')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
