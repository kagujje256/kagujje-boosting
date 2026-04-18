import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { callProviderAPI } from '@/lib/provider-api';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const body = await request.json();
    
    const { service_id, link, quantity, custom_currency } = body;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get service with provider
    const { data: service } = await supabase
      .from('services')
      .select('*, providers(*)')
      .eq('id', service_id)
      .single();

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Calculate prices
    const userCurrency = custom_currency || profile.currency || 'USD';
    const price = (quantity * service.price_per_unit) / 1000;
    const costPrice = (quantity * (service.cost_price || service.price_per_unit * 0.8)) / 1000;
    const profit = price - costPrice;

    // Check balance
    if (profile.balance < price) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Call provider API to create order
    const provider = service.providers as any;
    let externalOrderId = null;
    
    if (provider && service.external_service_id) {
      try {
        const providerResponse = await callProviderAPI(
          {
            url: provider.api_url,
            key: provider.api_key,
          },
          'add',
          {
            service: service.external_service_id,
            link,
            quantity
          }
        );
        externalOrderId = providerResponse.order;
      } catch (error) {
        console.error('Provider error:', error);
        // Continue with order even if provider fails - will be manual processed
      }
    }

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        service_id,
        provider_id: service.provider_id,
        external_order_id: externalOrderId,
        quantity,
        link,
        status: externalOrderId ? 'pending' : 'processing',
        price,
        cost_price: costPrice,
        profit,
        currency: userCurrency
      })
      .select()
      .single();

    if (error) throw error;

    // Deduct balance
    await supabase
      .from('profiles')
      .update({
        balance: profile.balance - price,
        spent: profile.spent + price
      })
      .eq('id', user.id);

    // Record transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'order',
        amount: -price,
        currency: userCurrency,
        description: `Order #${order.id.slice(0, 8)} - ${service.name}`,
        reference_id: order.id,
        status: 'completed'
      });

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
