import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    
    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    // Get total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('price');
    
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;
    
    // Get pending orders
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingOrders: pendingOrders || 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ 
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
    });
  }
}