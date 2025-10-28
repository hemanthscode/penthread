import { format, parseISO, formatDistanceToNow } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return format(parseISO(dateStr), 'PPpp');
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}
