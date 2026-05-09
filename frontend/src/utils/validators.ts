/**
 * Validation constants and helper functions for client-side input validation.
 *
 * These enforce the file-size and format rules described in Requirements
 * 1.4, 1.5, 2.6, 2.8, and 2.10 before any request is sent to the backend.
 */

// ── Size limits ────────────────────────────────────────────────────────────

/** Maximum allowed PDF upload size: 20 MB (Requirement 1.5) */
export const PDF_MAX_BYTES = 20 * 1024 * 1024;

/** Maximum allowed video upload size: 100 MB (Requirement 2.8) */
export const VIDEO_MAX_BYTES = 100 * 1024 * 1024;

// ── URL pattern ────────────────────────────────────────────────────────────

/**
 * Matches valid YouTube URLs in the two canonical forms (Requirement 2.6):
 *   https://www.youtube.com/watch?v=<11-char-id>
 *   https://youtu.be/<11-char-id>
 *
 * The video ID must be exactly 11 word-characters or hyphens.
 */
export const YOUTUBE_PATTERN =
  /^https:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;

// ── Accepted video extensions ──────────────────────────────────────────────

/** Accepted video file extensions (Requirement 2.10) */
export const ACCEPTED_VIDEO_EXTS = [".mp4", ".webm"] as const;

// ── Validator functions ────────────────────────────────────────────────────

/**
 * Returns `true` when `url` matches the YouTube URL pattern.
 * Returns `false` for any other string, including empty strings.
 *
 * Requirement 2.6: invalid URLs must produce a message containing
 * "invalid YouTube URL" — callers are responsible for that message.
 */
export function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_PATTERN.test(url);
}

/**
 * Validates a video file against size and extension rules.
 *
 * Returns `null` when the file is valid.
 * Returns an error message string when the file is invalid:
 *   - Size > 100 MB → message contains "100 MB" and "file size limit" (Req 2.8)
 *   - Unsupported extension → message contains "unsupported format" (Req 2.10)
 */
export function isValidVideoFile(file: File): string | null {
  // Extension check (case-insensitive) — Requirement 2.10
  const lowerName = file.name.toLowerCase();
  const hasValidExt = ACCEPTED_VIDEO_EXTS.some((ext) =>
    lowerName.endsWith(ext)
  );
  if (!hasValidExt) {
    return "unsupported format — please upload an .mp4 or .webm file";
  }

  // Size check — Requirement 2.8
  if (file.size > VIDEO_MAX_BYTES) {
    return "file size limit exceeded — maximum allowed size is 100 MB";
  }

  return null;
}

/**
 * Validates a PDF file against the size rule.
 *
 * Returns `null` when the file is valid.
 * Returns an error message string when the file is invalid:
 *   - Size > 20 MB → message contains "20 MB" and "file size limit" (Req 1.5)
 *
 * Note: MIME / magic-byte validation is performed server-side (Req 1.4).
 */
export function isValidPdfFile(file: File): string | null {
  if (file.size > PDF_MAX_BYTES) {
    return "file size limit exceeded — maximum allowed size is 20 MB";
  }
  return null;
}
