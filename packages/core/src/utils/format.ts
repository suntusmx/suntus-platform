import { format as formatDate, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCurrency = (amount: number, currency = 'MXN'): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDateLocale = (date: Date | string, formatStr = 'PP'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDate(dateObj, formatStr, { locale: es });
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
};

