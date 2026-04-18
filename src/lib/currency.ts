// Currency Utilities
export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1 },
  UGX: { symbol: 'USh', name: 'Ugandan Shilling', rate: 3800 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.79 },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', rate: 154 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const curr = CURRENCIES[currency];
  const value = amount * (currency === 'USD' ? 1 : curr.rate);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'UGX' || currency === 'KES' ? 0 : 2,
  }).format(value);
}

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / CURRENCIES[from].rate;
  return usdAmount * CURRENCIES[to].rate;
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCIES[currency].symbol;
}
