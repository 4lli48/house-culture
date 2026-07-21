import type { Device } from '../hooks/useDevices';

export const DEVICE_STATUSES: Device['status'][] = ['Working', 'Maintenance', 'Broken', 'Lost'];

export function getStatusLabelKey(status: Device['status']) {
  return status.toLowerCase();
}

export function getStatusBadgeClass(status: Device['status']) {
  switch (status) {
    case 'Working':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30';
    case 'Broken':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-500/30';
    case 'Lost':
      return 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20 dark:bg-navy-800 dark:text-slate-300 dark:ring-navy-600/40';
    case 'Maintenance':
    default:
      return 'bg-gold-50 text-gold-700 ring-1 ring-gold-600/20 dark:bg-gold-950/40 dark:text-gold-300 dark:ring-gold-500/30';
  }
}

export function getStatusTone(status: Device['status']) {
  switch (status) {
    case 'Working':
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        border: 'hover:border-emerald-300 dark:hover:border-emerald-800',
        color: '#10B981',
      };
    case 'Maintenance':
      return {
        text: 'text-gold-600 dark:text-gold-400',
        bg: 'bg-gold-50 dark:bg-gold-950/40',
        border: 'hover:border-gold-300 dark:hover:border-gold-800',
        color: '#C5A059',
      };
    case 'Broken':
      return {
        text: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/50',
        border: 'hover:border-rose-300 dark:hover:border-rose-800',
        color: '#F43F5E',
      };
    case 'Lost':
    default:
      return {
        text: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-100 dark:bg-navy-800',
        border: 'hover:border-slate-300 dark:hover:border-navy-700',
        color: '#64748B',
      };
  }
}
