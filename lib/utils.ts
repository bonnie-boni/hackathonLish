export function formatCurrency(amount: number, currency = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatKES(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
}

export function calculateTax(subtotal: number, rate = 0.08): number {
  return subtotal * rate;
}

export function calculateTotal(subtotal: number, shipping = 0, taxRate = 0.08): number {
  return subtotal + shipping + calculateTax(subtotal, taxRate);
}

export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const suffix = Array.from({ length: 2 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  const num = Math.floor(80000 + Math.random() * 9999);
  return `ORD-${num}-${suffix}`;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}
