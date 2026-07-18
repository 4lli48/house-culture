import type { Device } from '../hooks/useDevices';

export const DEVICE_STATUSES: Device['status'][] = ['Working', 'Maintenance', 'Broken', 'Lost'];

export function getStatusLabelKey(status: Device['status']) {
  return status.toLowerCase();
}

export function getStatusBadgeClass(status: Device['status']) {
  switch (status) {
    case 'Working':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Broken':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'Lost':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'Maintenance':
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
}

export function getStatusTone(status: Device['status']) {
  switch (status) {
    case 'Working':
      return {
        text: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/50',
        border: 'hover:border-green-300 dark:hover:border-green-700',
        color: '#10b981',
      };
    case 'Maintenance':
      return {
        text: 'text-yellow-600',
        bg: 'bg-yellow-100 dark:bg-yellow-900/50',
        border: 'hover:border-yellow-300 dark:hover:border-yellow-700',
        color: '#f59e0b',
      };
    case 'Broken':
      return {
        text: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/50',
        border: 'hover:border-red-300 dark:hover:border-red-700',
        color: '#ef4444',
      };
    case 'Lost':
    default:
      return {
        text: 'text-gray-600',
        bg: 'bg-gray-100 dark:bg-gray-700',
        border: 'hover:border-gray-300 dark:hover:border-gray-600',
        color: '#6b7280',
      };
  }
}
