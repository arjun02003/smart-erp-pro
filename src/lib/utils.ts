import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
  if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    paid: 'badge-success',
    active: 'badge-success',
    received: 'badge-success',
    pending: 'badge-warning',
    shipped: 'badge-secondary',
    partial: 'badge-primary',
    overdue: 'badge-danger',
    cancelled: 'badge-danger',
    on_leave: 'badge-warning',
  };
  return map[status] || 'badge-secondary';
}

export function generateInvoiceId(): string {
  const d = new Date();
  const num = Math.floor(Math.random() * 900 + 100);
  return `INV-${d.getFullYear()}-${num}`;
}

export function calculateGST(amount: number, rate: number) {
  const gst = (amount * rate) / 100;
  return { cgst: gst / 2, sgst: gst / 2, total: gst, grandTotal: amount + gst };
}
