# Implementation Plan: AI Powered Smart Summarizer

## Overview

This plan converts the design into incremental coding tasks, building from the backend foundation upward through the FastAPI layer, then the React frontend, and finally wiring everything together. Each task references specific requirements for traceability. Property-based tests (hypothesis / fast-check) are included as optional sub-tasks alongside unit tests.

---

## Tasks

- [x] 1. Set up project structure and shared foundations
  - Create the `app/` package with `__init__.py` and subdirectories `extractors/`, `generators/`, `exceptions/`
  - Create `app/exceptions.py` defining `SummarizerError` base class and all custom exception subclasses (`InvalidFileError`, `FileSizeError`, `PasswordError`, `NoTextError`, `VideoAccessError`, `NoSpeechError`, `EmptyContentError`, `AIServiceError`, `IncompleteResponseError`) each carrying `http_status` and `user_message`
  - Create `app/models.py` with Pydantic models: `ChapterItem`, `StructuredNotes`, `ErrorResponse`, `SummarizeRequest`
  - Add `requirements.txt` (or `pyproject.toml`) entries for `fastapi`, `uvicorn`, `pypdf`, `openai-whisper`, `yt-dlp`, `google-generativeai`, `hypothesis`, `pytest`, `pytest-asyncio`, `httpx`
  - _Requirements: 1.1–1.6, 2.1–2.10, 3.1–3.8, 4.1–4.5, 5.1–5.5, 6.1–6.5_

- [x] 2. Implement text truncation utility
  - [x] 2.1 Create `app/utils/truncate.py` with `truncate_text(text: str, max_chars: int = 30_000) -> str`
    - Implement: return unchanged if `len(text) <= max_chars`; otherwise return `text[:15_000] + text[-15_000:]`
    - _Requirements: 3.5_

  - [ ]* 2.2 Write property test for `truncate_text` (Property 1)
    - Create `tests/unit/test_truncate.py`
    - **Property 1: Text truncation preserves boundaries**
    - Use `@given(st.text(min_size=0, max_size=60_000))` with `@settings(max_examples=200)`
    - Assert: if `len(text) <= 30_000` → result equals input; else result equals `text[:15_000] + text[-15_000:]` and `len(result) == 30_000`
    - **Validates: Requirements 3.5**

- [x] 3. Implement PDF extractor
  - [x] 3.1 Create `app/extractors/pdf_extractor.py` with `extract_text(file_bytes: bytes) -> str`
    - Implement validation order: size check (> 20 MB → `FileSizeError`), magic bytes check (`file_bytes[:4] != b'%PDF'` → `InvalidFileError`), open with `pypdf.PdfReader`, catch `FileNotDecryptedError` → `PasswordError`, iterate pages accumulating text, blank result → `NoTextError`
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 3.2 Write property test for invalid file rejection (Property 2)
    - Create `tests/unit/test_validators.py` (backend)
    - **Property 2: Invalid files are always rejected**
    - Use `@given(st.binary().filter(lambda b: not b.startswith(b'%PDF')))` with `@settings(max_examples=100)`
    - Assert: `extract_text` raises `InvalidFileError`
    - **Validates: Requirements 1.4**

  - [ ]* 3.3 Write property test for oversized PDF rejection (Property 3)
    - **Property 3: Oversized PDFs are always rejected**
    - Use `@given(st.binary(min_size=20*1024*1024+1, max_size=25*1024*1024))` with `@settings(max_examples=50)`
    - Assert: `extract_text` raises `FileSizeError`
    - **Validates: Requirements 1.5**

  - [ ]* 3.4 Write unit tests for PDF extractor edge cases
    - Create `tests/unit/test_pdf_extractor.py`
    - Test: image-only PDF returns `NoTextError`, password-protected PDF returns `PasswordError`, valid PDF returns concatenated text
    - _Requirements: 1.2, 1.3, 1.6_

- [x] 4. Implement video transcriber
  - [x] 4.1 Create `app/extractors/video_transcriber.py` with `transcribe_youtube(url: str) -> str` and `transcribe_file(file_bytes: bytes, filename: str) -> str`
    - YouTube flow: validate URL regex, use `yt_dlp.YoutubeDL` with audio extraction options, catch `yt_dlp.utils.DownloadError` → `VideoAccessError`, load Whisper `base` model, call `model.transcribe`, empty result → `NoSpeechError`
    - Local file flow: write to `tempfile.NamedTemporaryFile`, same Whisper steps
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.7, 2.9_

  - [ ]* 4.2 Write unit tests for video transcriber
    - Create `tests/unit/test_video_transcriber.py`
    - Mock `yt_dlp.YoutubeDL` and `whisper.load_model` to test: inaccessible URL → `VideoAccessError`, silent audio → `NoSpeechError`, successful transcription returns non-empty string
    - _Requirements: 2.3, 2.5, 2.7, 2.9_

- [x] 5. Implement note generator
  - [x] 5.1 Create `app/generators/note_generator.py` with `generate_notes(text: str) -> StructuredNotes`
    - Call `truncate_text`, build the structured prompt, call Gemini with `response_mime_type="application/json"` and `response_schema`, wrap call in `asyncio.wait_for(..., timeout=30.0)`, catch `asyncio.TimeoutError` → `AIServiceError`
    - Validate response has `key_points` (≥ 3) and `bullet_summary` (≥ 3); if missing, retry once; if second attempt also fails → `IncompleteResponseError`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.8_

  - [ ]* 5.2 Write unit tests for note generator
    - Create `tests/unit/test_note_generator.py`
    - Mock Gemini client to test: timeout → `AIServiceError`, incomplete first response + complete retry → success, incomplete both attempts → `IncompleteResponseError`, valid response → `StructuredNotes` with correct fields
    - _Requirements: 3.1, 3.6, 3.8_

  - [ ]* 5.3 Write property test for structured notes invariants (Property 8)
    - **Property 8: Structured notes always contain required sections**
    - Use `@given(st.builds(StructuredNotes, ...))` or generate mock Gemini responses with hypothesis
    - Assert: `key_points` has ≥ 3 elements, `bullet_summary` has ≥ 3 elements, each `bullet_summary` item ≤ 25 words
    - **Validates: Requirements 3.2, 3.3**

  - [ ]* 5.4 Write property test for chapter detection consistency (Property 9)
    - **Property 9: Chapter detection is consistent with heading count**
    - Generate texts with 0–1 headings and texts with 2+ headings; assert `chapters` is absent/null for the former and present/non-empty for the latter
    - **Validates: Requirements 3.4**

- [x] 6. Checkpoint — backend core complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement FastAPI application
  - [x] 7.1 Create `app/main.py` with `POST /summarize` and `POST /log-error` endpoints
    - `POST /summarize`: accept `multipart/form-data` with `input_type`, optional `file: UploadFile`, optional `youtube_url`; route to `PDF_Extractor` or `Video_Transcriber` based on `input_type`; validate extracted text is non-empty (else `EmptyContentError`); call `Note_Generator`; return `StructuredNotes` JSON
    - `POST /log-error`: accept `{"reason": str, "timestamp": str}`, log to application logger, return `{"ok": true}`
    - Register `SummarizerError` exception handler that returns `{"detail": exc.user_message}` with `exc.http_status`
    - _Requirements: 1.1–1.6, 2.1–2.10, 3.1–3.8, 4.3, 5.5, 6.3_

  - [ ]* 7.2 Write property test for whitespace-only content rejection (Property 4)
    - Add to `tests/unit/test_validators.py`
    - **Property 4: Whitespace-only content is always rejected**
    - Use `@given(st.text(alphabet=st.characters(whitelist_categories=('Zs', 'Cc')), min_size=1))` with `@settings(max_examples=100)`
    - Assert: endpoint returns HTTP 400 containing "extracted content is empty"
    - **Validates: Requirements 6.3**

  - [ ]* 7.3 Write integration tests for `/summarize` endpoint
    - Create `tests/integration/test_summarize_endpoint.py` using `httpx.AsyncClient` with mocked Gemini and Whisper
    - Cover all HTTP status codes: 200, 400, 413, 422 (invalid file, password, no text, video access, no speech), 503 (AI timeout, incomplete)
    - _Requirements: 1.2–1.6, 2.7, 2.9, 3.6, 3.8, 6.3_

- [x] 8. Set up React + Vite frontend
  - [x] 8.1 Scaffold Vite + React + TypeScript project in `frontend/`
    - Run `npm create vite@latest frontend -- --template react-ts`
    - Install dependencies: `jspdf`, `fast-check`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jest-axe`, `@axe-core/react`
    - Create `frontend/src/design-tokens.css` with CSS custom properties for all colors, spacing units, font families, and font sizes referenced in the design
    - _Requirements: 7.1, 7.2_

  - [x] 8.2 Create TypeScript interfaces and validation constants
    - Create `frontend/src/types.ts` with `ChapterItem`, `StructuredNotes`, `SummarizerState` interfaces
    - Create `frontend/src/utils/validators.ts` with `PDF_MAX_BYTES`, `VIDEO_MAX_BYTES`, `YOUTUBE_PATTERN`, `ACCEPTED_VIDEO_EXTS` constants and `isValidYouTubeUrl`, `isValidVideoFile`, `isValidPdfFile` functions
    - _Requirements: 1.4, 1.5, 2.6, 2.8, 2.10_

  - [ ]* 8.3 Write property tests for frontend validators (Properties 5, 6, 7)
    - Create `frontend/src/__tests__/validators.test.ts`
    - **Property 5: YouTube URL validation is exhaustive** — valid URLs always pass, non-YouTube strings always fail (`numRuns: 200`)
    - **Property 6: Oversized video files are always rejected** — `fc.integer({ min: VIDEO_MAX_BYTES + 1 })` → message contains "100 MB" and "file size limit"
    - **Property 7: Unsupported video formats are always rejected** — filenames not ending in `.mp4`/`.webm` → message contains "unsupported format"
    - **Validates: Requirements 2.6, 2.8, 2.10**

- [x] 9. Implement frontend utility modules
  - [x] 9.1 Create `frontend/src/utils/pdfExporter.ts`
    - Implement `exportToPdf(notes: StructuredNotes): void` using jsPDF
    - Include title "AI Powered Smart Summarizer", ISO 8601 timestamp, all sections with headings before content, filename `smart-notes-<timestamp>.pdf`
    - On error: display "PDF generation failed" message and POST to `/log-error` with reason and UTC timestamp
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 9.2 Write property test for PDF export validity (Property 10)
    - Create `frontend/src/__tests__/pdfExporter.test.ts`
    - **Property 10: PDF export always produces a valid PDF**
    - Use `fc.record({ key_points: fc.array(fc.string(), { minLength: 3 }), bullet_summary: fc.array(fc.string(), { minLength: 3 }) })` to generate arbitrary `StructuredNotes`
    - Assert: output bytes start with `%PDF-`, contain "AI Powered Smart Summarizer", contain ISO 8601 timestamp, file size ≤ 5 MB
    - **Validates: Requirements 5.3, 5.4**

  - [x] 9.3 Create `frontend/src/utils/truncate.ts`
    - Mirror backend `truncate_text` logic for display purposes
    - _Requirements: 3.5_

- [x] 10. Implement `useSummarizer` hook
  - [x] 10.1 Create `frontend/src/hooks/useSummarizer.ts`
    - Implement state machine: `idle → submitting → extracting → transcribing (video) → generating → success | error`
    - Handle network errors (`TypeError: Failed to fetch`, status 0): set `isNetwork: true`, show "connection problem" + Retry button
    - Handle API errors (4xx/5xx): set `isNetwork: false`, display `response.detail`
    - Expose `submit(formData: FormData)`, `retry()`, and current `state`
    - _Requirements: 4.3, 4.4, 6.4, 6.5_

  - [ ]* 10.2 Write unit tests for `useSummarizer` state machine
    - Create `frontend/src/__tests__/useSummarizer.test.ts`
    - Test: idle → submitting on submit, success transition sets notes, network error sets `isNetwork: true`, retry resubmits same request, API error displays detail message
    - _Requirements: 4.3, 4.4, 6.4, 6.5_

- [x] 11. Implement React UI components
  - [x] 11.1 Create `HeroSection.tsx` and `ErrorPanel.tsx`
    - `HeroSection`: render app title and description in the hero section
    - `ErrorPanel`: render error message in a red/amber panel; strip any content matching stack trace (`Traceback`, `at line`, `File "`), API key (`AIza`), or path patterns (`C:\`, `/home/`, `/usr/`) before rendering
    - _Requirements: 4.5, 7.1_

  - [ ]* 11.2 Write property test for error message sanitization (Property 11)
    - Create `frontend/src/__tests__/ErrorPanel.test.tsx`
    - **Property 11: Error messages never expose sensitive information**
    - Use `fc.string()` to generate arbitrary error strings; assert rendered output contains none of `Traceback`, `at line`, `File "`, `AIza`, `C:\`, `/home/`, `/usr/`
    - **Validates: Requirements 4.5**

  - [x] 11.3 Create `ProgressIndicator.tsx`
    - Cycle through stage labels: "Extracting content…", "Transcribing audio…" (video only), "Generating notes…"
    - Hide when state is `idle`, `success`, or `error`
    - Announce stage changes to screen readers via `aria-live="polite"`
    - _Requirements: 4.3_

  - [x] 11.4 Create `NoteCard.tsx` and `ResultsSection.tsx`
    - `NoteCard`: render a section card with visible border/background, `h2`/`h3` heading, SVG/font icon adjacent to heading, body text ≥ 16px font size
    - `ResultsSection`: render Key Points, Bullet-wise Summary, and (conditionally) Chapter-wise Breakdown cards; show "Download as PDF" button when notes are present; on download click call `exportToPdf`
    - On success: hide progress indicator and smooth-scroll to results within 300ms
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.2_

  - [ ]* 11.5 Write unit tests for `ResultsSection`
    - Create `frontend/src/__tests__/ResultsSection.test.tsx`
    - Test: all three cards render when chapters present, chapters card absent when `chapters` is null/undefined, "Download as PDF" button visible on success, heading elements present
    - _Requirements: 4.1, 4.2, 5.1_

  - [x] 11.6 Create `InputSection.tsx`
    - Render "Upload PDF" file input (`accept=".pdf"`), "YouTube URL" text input, "Upload Video" file input (`accept=".mp4,.webm"`)
    - Show always-visible helper text: "Accepted: .pdf — Max size: 20 MB" and "Accepted: .mp4, .webm — Max size: 100 MB"
    - Inline validation: "at least one input is required", "only one input type at a time", "invalid YouTube URL", "100 MB" + "file size limit", "unsupported format"
    - Disable submit button and show spinner/loading label during processing
    - All controls have descriptive `aria-label` attributes
    - _Requirements: 1.1, 2.1, 2.6, 2.8, 2.10, 6.1, 6.2, 6.4, 7.5, 7.6, 7.7_

  - [ ]* 11.7 Write unit tests for `InputSection` aria-labels and helper text (Property 12)
    - Create `frontend/src/__tests__/InputSection.test.tsx`
    - **Property 12: All interactive controls always have aria-labels**
    - Assert: file upload button, YouTube URL input, submit button, and download button (when visible) each have a non-empty `aria-label`
    - Assert: helper text for both upload controls is visible in all states
    - **Validates: Requirements 7.5, 7.6**

- [x] 12. Checkpoint — all components implemented
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Wire frontend and backend together in `App.tsx`
  - [x] 13.1 Create `frontend/src/App.tsx` as root layout
    - Import `design-tokens.css`
    - Compose `HeroSection`, `InputSection`, `ProgressIndicator`, `ResultsSection`, `ErrorPanel` in top-to-bottom document order
    - Pass `useSummarizer` state and callbacks to child components
    - Ensure results section is hidden on initial page load; all other sections visible
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 13.2 Apply responsive layout and design token enforcement
    - Ensure no horizontal scrollbar and no clipping/overlap at 320px–1920px viewports using CSS custom properties from `design-tokens.css`
    - Verify Tab/Shift+Tab keyboard navigation order matches DOM order with visible focus indicators
    - _Requirements: 7.2, 7.3, 7.4, 7.7_

  - [ ]* 13.3 Write accessibility integration tests
    - Create `frontend/src/__tests__/App.test.tsx`
    - Use `jest-axe` to run automated WCAG 2.1 AA checks on rendered `App` in idle, success, and error states
    - Assert no axe violations
    - _Requirements: 7.4, 7.5_

- [x] 14. Final checkpoint — full integration
  - Ensure all backend and frontend tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 6, 12, and 14 ensure incremental validation
- Property tests (hypothesis / fast-check) validate universal correctness invariants; unit tests cover specific examples and edge cases
- The backend runs with `uvicorn app.main:app --reload`; the frontend runs with `npm run dev` inside `frontend/`
- Whisper `base` model is loaded once at startup to avoid per-request cold-start latency

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2.1", "8.1"] },
    { "id": 1, "tasks": ["3.1", "8.2"] },
    { "id": 2, "tasks": ["4.1", "9.3"] },
    { "id": 3, "tasks": ["5.1", "9.1"] },
    { "id": 4, "tasks": ["7.1", "10.1"] },
    { "id": 5, "tasks": ["11.1"] },
    { "id": 6, "tasks": ["11.3", "11.4", "11.6"] },
    { "id": 7, "tasks": ["13.1"] },
    { "id": 8, "tasks": ["13.2"] }
  ]
}
```
