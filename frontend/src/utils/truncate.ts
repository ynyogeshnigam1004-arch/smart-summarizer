/**
 * Utility for truncating large text before display.
 *
 * Mirrors the backend `truncate_text` logic in `app/utils/truncate.py`.
 *
 * Requirement 3.5: The Note_Generator SHALL truncate input text to a maximum
 * of 30,000 characters by preserving the first 15,000 and the last 15,000
 * characters of the source text.
 */

/**
 * Truncate text to at most `maxChars` characters.
 *
 * If `text.length <= maxChars`, the original string is returned unchanged.
 * Otherwise, the first `maxChars / 2` characters are concatenated with the
 * last `maxChars / 2` characters and returned.
 *
 * @param text     The source text to (potentially) truncate.
 * @param maxChars Maximum allowed character count. Defaults to 30,000.
 * @returns        The original string when it fits within `maxChars`, or the
 *                 head + tail concatenation when it does not.
 */
export function truncateText(text: string, maxChars = 30_000): string {
  if (text.length <= maxChars) {
    return text;
  }
  const half = Math.floor(maxChars / 2);
  return text.slice(0, half) + text.slice(text.length - half);
}
