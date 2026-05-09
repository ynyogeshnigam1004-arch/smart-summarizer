/**
 * Represents a single chapter entry in the structured notes.
 */
export interface ChapterItem {
  title: string;
  summary: string;
}

/**
 * The structured notes object returned by the Summarizer API.
 * - key_points: at least 3 distinct topic points
 * - bullet_summary: at least 3 bullets, each ≤ 25 words
 * - chapters: optional chapter-wise breakdown (present only when source has 2+ sections)
 */
export interface StructuredNotes {
  key_points: string[];
  bullet_summary: string[];
  chapters?: ChapterItem[];
}

/**
 * Discriminated union representing every possible state of the summarizer UI.
 *
 * - idle:        No request in flight; initial state.
 * - submitting:  Form submitted; waiting for the first backend stage.
 * - extracting:  Backend is extracting content from the uploaded file.
 * - transcribing: Backend is transcribing audio (video inputs only).
 * - generating:  Backend is generating notes via the AI model.
 * - success:     Notes have been received and are ready to display.
 * - error:       A recoverable error occurred.
 *   - isNetwork: true  → network-level failure ("connection problem" + Retry)
 *   - isNetwork: false → API-level error (display response.detail)
 */
export type SummarizerState =
  | { status: "idle" }
  | { status: "submitting" | "extracting" | "transcribing" | "generating" }
  | { status: "success"; notes: StructuredNotes }
  | { status: "error"; message: string; isNetwork: boolean };
