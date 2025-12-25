import { format } from 'date-fns';

export const formatDate = (date: Date | string) => {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  return format(parsed, 'dd MMM yyyy');
};
