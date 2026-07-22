import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error';
}

export const ADMIN_EMAIL = 'abdulilahsalh@gmail.com';

export function getUserRole(email?: string | null): 'admin' | 'employee' {
  if (email && email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return 'admin';
  }
  return 'employee';
}

export function getUserRoleLabel(email?: string | null): 'مدير' | 'موظف' {
  return getUserRole(email) === 'admin' ? 'مدير' : 'موظف';
}
