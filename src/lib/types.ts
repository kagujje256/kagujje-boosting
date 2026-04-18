export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  balance: number;
  spent: number;
  role: 'user' | 'admin' | 'reseller';
  referral_code: string;
  referred_by: string | null;
  discount_percentage: number;
  api_key: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  display_order: number;
  is_visible: boolean;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string | null;
  min_order: number;
  max_order: number;
  price_per_unit: number;
  original_price: number | null;
  provider: string | null;
  provider_service_id: string | null;
  refill: boolean;
  refill_days: number;
  speed: string;
  quality: string;
  average_time: string | null;
  is_visible: boolean;
  is_featured: boolean;
  display_order: number;
  category?: Category;
}

export interface Order {
  id: string;
  user_id: string;
  service_id: string;
  link: string;
  quantity: number;
  price: number;
  start_count: number | null;
  remains: number | null;
  status: 'pending' | 'processing' | 'in_progress' | 'completed' | 'partial' | 'cancelled' | 'refunded';
  provider_order_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  service?: Service;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'order' | 'refund' | 'bonus' | 'referral';
  amount: number;
  balance_after: number | null;
  reference: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  status: 'open' | 'answered' | 'closed';
  created_at: string;
  updated_at: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string | null;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export interface Settings {
  site_name: string;
  site_tagline: string;
  min_deposit: number;
  referral_bonus: number;
  marzpay_api_key: string;
  marzpay_api_secret: string;
}
