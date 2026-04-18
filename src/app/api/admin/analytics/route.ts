import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('end') || new Date().toISOString().split('T')[0];
    const currency = searchParams.get('currency') || 'USD';

    // Get orders in date range
    const { data: orders } = await supabase
      .from('orders')
      .select('id, price, cost_price, profit, currency, created_at, status')
      .gte('created_at', startDate)
      .lte('created_at', endDate + 'T23:59:59')
      .neq('status', 'cancelled');

    // Get exchange rates
    const { data: rates } = await supabase
      .from('exchange_rates')
      .select('*');

    const exchangeRates: Record<string, number> = {};
    rates?.forEach(r => {
      exchangeRates[`${r.from_currency}_${r.to_currency}`] = r.rate;
    });

    function convertToUSD(amount: number, fromCurrency: string): number {
      if (fromCurrency === 'USD') return amount;
      const rate = exchangeRates[`${fromCurrency}_USD`];
      return rate ? amount * rate : amount;
    }

    // Calculate totals
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    const dailyData: Record<string, { orders: number; revenue: number; cost: number; profit: number }> = {};

    orders?.forEach(order => {
      const orderDate = order.created_at.split('T')[0];
      const priceUSD = convertToUSD(order.price, order.currency);
      const costUSD = convertToUSD(order.cost_price || 0, order.currency);
      const profitUSD = convertToUSD(order.profit || 0, order.currency);

      totalOrders++;
      totalRevenue += priceUSD;
      totalCost += costUSD;
      totalProfit += profitUSD;

      if (!dailyData[orderDate]) {
        dailyData[orderDate] = { orders: 0, revenue: 0, cost: 0, profit: 0 };
      }
      dailyData[orderDate].orders++;
      dailyData[orderDate].revenue += priceUSD;
      dailyData[orderDate].cost += costUSD;
      dailyData[orderDate].profit += profitUSD;
    });

    // Get top services
    const { data: topServices } = await supabase
      .from('orders')
      .select('service_id, services(name), quantity, price')
      .gte('created_at', startDate)
      .lte('created_at', endDate + 'T23:59:59')
      .limit(10);

    // Get recent transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          totalRevenue: totalRevenue.toFixed(2),
          totalCost: totalCost.toFixed(2),
          totalProfit: totalProfit.toFixed(2),
          profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : '0'
        },
        chart: Object.entries(dailyData).map(([date, data]) => ({
          date,
          ...data
        })).sort((a, b) => a.date.localeCompare(b.date)),
        transactions
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
