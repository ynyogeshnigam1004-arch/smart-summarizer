export function truncateText(text, maxLength = 30000) {
  if (text.length <= maxLength) {
    return text;
  }

  const halfLength = Math.floor(maxLength / 2);
  const start = text.slice(0, halfLength);
  const end = text.slice(-halfLength);

  return start + '\n\n[... content truncated ...]\n\n' + end;
}
