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
  category_id: string | null;
  category?: Category;
  provider_id: string | null;
  external_service_id: string | null;
  description: string;
  min_order: number;
  max_order: number;
  price_per_unit: number;
  cost_price: number;
  profit_percent: number;
  currency: string;
  unit: string;
  is_active: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  service_id: string;
  service?: Service;
  provider_id: string | null;
  external_order_id: string | null;
  quantity: number;
  link: string;
  status: string;
  price: number;
  cost_price: number;
  profit: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'order' | 'refund';
  amount: number;
  currency: string;
  amount_usd: number;
  description: string | null;
  reference_id: string | null;
  status: string;
  created_at: string;
}

export interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  updated_at: string;
}

export interface ProfitAnalytics {
  id: string;
  date: string;
  total_orders: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  currency: string;
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
