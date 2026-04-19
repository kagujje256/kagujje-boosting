import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { api_url, api_key } = await request.json();

    if (!api_url || !api_key) {
      return NextResponse.json({ 
        success: false, 
        error: 'API URL and API key are required' 
      }, { status: 400 });
    }

    // Test connection by fetching balance
    const formData = new URLSearchParams();
    formData.append('key', api_key);
    formData.append('action', 'balance');

    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ 
        success: false, 
        error: data.error 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      balance: data.balance,
      currency: data.currency 
    });

  } catch (error) {
    console.error('Provider test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to provider' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const api_url = searchParams.get('api_url');
    const api_key = searchParams.get('api_key');

    if (!api_url || !api_key) {
      return NextResponse.json({ 
        success: false, 
        error: 'API URL and API key are required' 
      }, { status: 400 });
    }

    // Fetch services from provider
    const formData = new URLSearchParams();
    formData.append('key', api_key);
    formData.append('action', 'services');

    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const services = await response.json();

    if (!Array.isArray(services)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid response from provider' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      services: services,
      count: services.length 
    });

  } catch (error) {
    console.error('Provider services error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch services' 
    }, { status: 500 });
  }
}
