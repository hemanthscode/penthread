export function truncate(text, max = 120) {
  if (!text) return '';
  return text.length > max ? text.substring(0, max).trimEnd() + '…' : text;
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
