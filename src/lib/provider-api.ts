// Provider API Integration
// Supports multiple SMM panel providers

export interface Provider {
  id: string;
  name: string;
  slug: string;
  api_url: string;
  api_key: string;
  currency: string;
  balance: number;
  is_active: boolean;
  is_default: boolean;
}

export interface ProviderService {
  service: number;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
}

export interface ProviderOrder {
  order: number;
  charge?: string;
  status?: string;
  error?: string;
}

export class ProviderAPI {
  constructor(private provider: Provider) {}

  private async request(action: string, params: Record<string, string | number> = {}): Promise<unknown> {
    const formData = new URLSearchParams();
    formData.append('key', this.provider.api_key);
    formData.append('action', action);
    
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const response = await fetch(this.provider.api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    return response.json();
  }

  async getBalance(): Promise<{ balance: string; currency: string }> {
    return this.request('balance') as Promise<{ balance: string; currency: string }>;
  }

  async getServices(): Promise<ProviderService[]> {
    return this.request('services') as Promise<ProviderService[]>;
  }

  async createOrder(serviceId: number, link: string, quantity: number): Promise<ProviderOrder> {
    return this.request('add', {
      service: serviceId,
      link,
      quantity,
    }) as Promise<ProviderOrder>;
  }

  async getOrderStatus(orderId: number): Promise<{
    charge: string;
    start_count: string;
    status: string;
    remains: string;
    currency: string;
  }> {
    return this.request('status', { order: orderId }) as Promise<{
      charge: string;
      start_count: string;
      status: string;
      remains: string;
      currency: string;
    }>;
  }
}

// Sync services from provider to database
export async function syncProviderServices(
  provider: Provider,
  supabase: any
): Promise<{ added: number; updated: number }> {
  const api = new ProviderAPI(provider);
  const services = await api.getServices();
  
  let added = 0;
  let updated = 0;
  
  for (const svc of services) {
    const { error } = await supabase
      .from('services')
      .upsert({
        name: svc.name,
        slug: `${provider.slug}-${svc.service}`,
        provider_id: provider.id,
        external_service_id: String(svc.service),
        description: `${svc.type} - ${svc.category}`,
        min_order: parseInt(svc.min),
        max_order: parseInt(svc.max),
        price_per_unit: parseFloat(svc.rate) / 1000, // Convert to per unit
        service_type: svc.type.toLowerCase().includes('comment') ? 'comments' : 
                      svc.type.toLowerCase().includes('follower') ? 'followers' : 'other',
        is_active: true,
      }, { onConflict: 'slug' });
    
    if (error) {
      updated++;
    } else {
      added++;
    }
  }
  
  return { added, updated };
}
