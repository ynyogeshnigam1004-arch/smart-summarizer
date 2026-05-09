# Requirements Document

## Introduction

AI Powered Smart Summarizer is a full-stack web application that accepts PDF documents and video lecture links (YouTube URLs or uploaded video files), extracts or transcribes their content, and uses an AI model (Google Gemini) to generate structured, meaningful notes. The output includes key points, a bullet-wise summary, and a chapter-wise breakdown where applicable. Users can download the generated notes as a PDF. The system provides a modern, beginner-friendly React frontend backed by a Python FastAPI service, with robust error handling throughout.

---

## Glossary

- **Summarizer**: The backend FastAPI service responsible for orchestrating content extraction, transcription, and AI summarization.
- **AI_Model**: The Google Gemini generative AI model used to produce structured notes.
- **PDF_Extractor**: The component that reads uploaded PDF files and extracts raw text.
- **Video_Transcriber**: The component that downloads or receives video content and converts audio to text using a speech-to-text service.
- **Note_Generator**: The component that sends extracted/transcribed text to the AI_Model and formats the structured output.
- **PDF_Exporter**: The component that converts structured notes into a downloadable PDF file.
- **Frontend**: The React web application that users interact with directly.
- **User**: A person using the Frontend to upload content and receive summarized notes.
- **Structured_Notes**: The AI-generated output containing key points, a bullet-wise summary, and an optional chapter-wise breakdown.
- **YouTube_URL**: A valid URL pointing to a publicly accessible YouTube video, matching the pattern `https://www.youtube.com/watch?v=<id>` or `https://youtu.be/<id>`.
- **Progress_Indicator**: A visual element in the Frontend that communicates processing status to the User.

---

## Requirements

### Requirement 1: PDF Upload and Text Extraction

**User Story:** As a User, I want to upload a PDF file, so that the system can extract its text content for summarization.

#### Acceptance Criteria

1. THE Frontend SHALL provide a file upload button with the visible label "Upload PDF" that accepts only files with the `.pdf` extension via the `accept=".pdf"` attribute.
2. WHEN a User uploads a PDF file, THE PDF_Extractor SHALL extract all readable text from every page of the document and return the concatenated text to the Summarizer.
3. WHEN a PDF file contains no extractable text (e.g., a scanned image-only PDF), THEN THE PDF_Extractor SHALL return an error message containing the phrase "no readable text" to the Summarizer, which SHALL forward it to the Frontend.
4. IF the uploaded file's MIME type is not `application/pdf` or its content does not begin with the `%PDF-` magic bytes, THEN THE Summarizer SHALL return an error response with HTTP status 422 and a message containing "invalid file type".
5. IF the uploaded PDF file exceeds 20 MB in size, THEN THE Summarizer SHALL reject the request and return an error response with HTTP status 413 and a message containing "20 MB" and "file size limit".
6. IF the uploaded PDF file is password-protected, THEN THE PDF_Extractor SHALL return an error message containing "password-protected" to the Summarizer, which SHALL return an error response with HTTP status 422 to the Frontend.

---

### Requirement 2: Video Lecture Link Submission

**User Story:** As a User, I want to submit a YouTube URL or upload a video file, so that the system can transcribe the audio for summarization.

#### Acceptance Criteria

1. THE Frontend SHALL provide a text input field labeled "YouTube URL" for entering a YouTube_URL and a separate file upload control labeled "Upload Video" that accepts files with `.mp4` or `.webm` extensions via the `accept=".mp4,.webm"` attribute.
2. WHEN a User submits a YouTube_URL, THE Video_Transcriber SHALL extract the audio track from the video.
3. WHEN THE Video_Transcriber has extracted the audio track from a YouTube_URL, THE Video_Transcriber SHALL convert that audio to text and return the transcript to the Summarizer.
4. WHEN a User uploads a local video file, THE Video_Transcriber SHALL extract the audio track from the file.
5. WHEN THE Video_Transcriber has extracted the audio track from a local video file, THE Video_Transcriber SHALL convert that audio to text and return the transcript to the Summarizer.
6. IF a submitted YouTube_URL does not match the pattern `https://www.youtube.com/watch?v=<id>` or `https://youtu.be/<id>`, THEN THE Frontend SHALL display an inline validation message containing "invalid YouTube URL" without submitting the request.
7. IF a YouTube video is private, age-restricted, or otherwise inaccessible, THEN THE Video_Transcriber SHALL return an error message containing "video cannot be accessed" to the Summarizer, which SHALL return an error response with HTTP status 422 to the Frontend.
8. IF the uploaded video file exceeds 100 MB in size, THEN THE Frontend SHALL display an inline validation message containing "100 MB" and "file size limit" without submitting the request.
9. IF the video contains no detectable audio or the audio is silent throughout, THEN THE Video_Transcriber SHALL return an error message containing "no speech detected" to the Summarizer, which SHALL return an error response with HTTP status 422 to the Frontend.
10. IF a User uploads a video file with an extension other than `.mp4` or `.webm`, THEN THE Frontend SHALL display an inline validation message containing "unsupported format" without submitting the request.

---

### Requirement 3: AI-Powered Structured Note Generation

**User Story:** As a User, I want the system to generate structured notes from extracted content, so that I can quickly understand the key information without reading the full source.

#### Acceptance Criteria

1. WHEN extracted or transcribed text is available, THE Note_Generator SHALL send the text to the AI_Model with a structured prompt explicitly requesting a "Key Points" section, a "Bullet-wise Summary" section, and a "Chapter-wise Breakdown" section.
2. THE Note_Generator SHALL ensure the Structured_Notes output always contains a "Key Points" section with at least three points, where each point covers a different topic or sub-topic present in the source content.
3. THE Note_Generator SHALL ensure the Structured_Notes output always contains a "Bullet-wise Summary" section with at least three bullet points, where each bullet point does not exceed 25 words.
4. WHEN the source content contains two or more of the following: explicit section headings, numbered chapters, or clear topic transitions marked by paragraph breaks of three or more lines, THE Note_Generator SHALL include a "Chapter-wise Breakdown" section in the Structured_Notes output.
5. THE Note_Generator SHALL truncate input text to a maximum of 30,000 characters before sending to the AI_Model by preserving the first 15,000 characters and the last 15,000 characters of the source text.
6. IF the AI_Model returns an error or does not respond within 30 seconds, THEN THE Note_Generator SHALL return an error response with HTTP status 503 and a message containing "AI service temporarily unavailable".
7. THE Note_Generator SHALL verify that no named entity (person, organization, location), numerical value, or factual claim present in the source text is contradicted in the Structured_Notes output.
8. IF the AI_Model response is missing the "Key Points" section or the "Bullet-wise Summary" section, THEN THE Note_Generator SHALL retry the request to the AI_Model once; IF the retry also returns an incomplete response, THEN THE Note_Generator SHALL return an error response with HTTP status 503 and a message containing "incomplete AI response".

---

### Requirement 4: Structured Notes Display

**User Story:** As a User, I want to see the generated notes clearly presented in the browser, so that I can read and review them immediately after processing.

#### Acceptance Criteria

1. WHEN Structured_Notes are returned by the Summarizer, THE Frontend SHALL render the Key Points section, Bullet-wise Summary section, and Chapter-wise Breakdown section (if present) each in a separate card element with a visible border or background color that distinguishes it from adjacent cards.
2. WHEN Structured_Notes are returned by the Summarizer, THE Frontend SHALL display each section with a heading element (`h2` or `h3`), at least one SVG or font icon adjacent to the heading, and body text set in a font size of at least 16px.
3. WHILE the Summarizer is processing a request, THE Frontend SHALL display a Progress_Indicator that cycles through the stage labels "Extracting content…", "Transcribing audio…" (for video inputs only), and "Generating notes…" in sequence, updating the label as each stage begins.
4. WHEN the Summarizer returns a successful response, THE Frontend SHALL hide the Progress_Indicator and smoothly scroll the viewport to the top of the results section within 300 milliseconds.
5. IF the Summarizer returns an error response, THE Frontend SHALL hide the Progress_Indicator, display the error message text from the response body in a visually distinct panel with a red or amber background, and SHALL NOT include any stack trace, API key, or internal path in the displayed message.

---

### Requirement 5: PDF Export of Summarized Notes

**User Story:** As a User, I want to download the generated notes as a PDF file, so that I can save and share them offline.

#### Acceptance Criteria

1. WHEN Structured_Notes are displayed, THE Frontend SHALL show a button with the visible label "Download as PDF".
2. WHEN a User clicks the "Download as PDF" button, THE PDF_Exporter SHALL generate a PDF document containing all sections present in the Structured_Notes, trigger a browser file download with the filename `smart-notes-<timestamp>.pdf`, and include the Chapter-wise Breakdown section only if it is present in the Structured_Notes.
3. THE PDF_Exporter SHALL include the document title "AI Powered Smart Summarizer", the generation timestamp in ISO 8601 format, and each note section with its heading rendered before its content in the exported PDF.
4. THE PDF_Exporter SHALL produce a file that begins with the `%PDF-` magic bytes and whose file size does not exceed 5 MB.
5. IF PDF generation fails, THEN THE PDF_Exporter SHALL display an error message containing "PDF generation failed" in the results section and SHALL write a log entry containing the failure reason and UTC timestamp to the server-side application log.

---

### Requirement 6: Input Validation and Error Handling

**User Story:** As a User, I want the system to clearly communicate problems with my input, so that I can correct mistakes without confusion.

#### Acceptance Criteria

1. WHEN a User attempts to submit the form without providing any input (no file selected and no URL entered), THE Frontend SHALL display an inline validation message containing "at least one input is required" adjacent to the submit button, without sending any request to the Summarizer.
2. WHEN a User has both a PDF file selected and a video source provided (URL or video file) simultaneously, THE Frontend SHALL display an inline validation message containing "only one input type at a time" and SHALL disable the submit button until one input is cleared.
3. IF the Summarizer receives a request whose extracted or transcribed text body is empty or contains only whitespace characters, THEN THE Summarizer SHALL return an error response with HTTP status 400 and a message containing "extracted content is empty".
4. THE Frontend SHALL set the submit button to a disabled state and display a spinner or loading label on the button for the entire duration between request submission and response receipt, re-enabling the button only after the response is received.
5. WHEN a network error (e.g., fetch rejection, timeout, or HTTP status 0) occurs during submission, THE Frontend SHALL display a message containing "connection problem" and a "Retry" button that resubmits the same request when clicked.

---

### Requirement 7: Modern and Accessible Frontend UI

**User Story:** As a User, I want a clean, modern, and beginner-friendly interface, so that I can use the application without technical knowledge.

#### Acceptance Criteria

1. THE Frontend SHALL render a single-page layout with a hero section, an input section, a Progress_Indicator section, and a results section arranged in top-to-bottom document order with no section hidden on initial page load except the results section.
2. THE Frontend SHALL apply a single application-wide design system such that no component uses a font family, spacing unit, or color value that is not defined in the shared design tokens or CSS variables.
3. THE Frontend SHALL be fully responsive such that at viewport widths from 320px to 1920px, no horizontal scrollbar appears and no UI element is clipped or overlaps another element.
4. THE Frontend SHALL meet WCAG 2.1 Level AA color contrast requirements (minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text) for all text and interactive elements.
5. THE Frontend SHALL provide a descriptive `aria-label` attribute on the file upload button, the YouTube URL input, the submit button, and the download button, where each `aria-label` value describes the control's purpose.
6. THE Frontend SHALL display always-visible helper text beneath each upload control stating the accepted file formats and the maximum file size limit (e.g., "Accepted: .pdf — Max size: 20 MB" and "Accepted: .mp4, .webm — Max size: 100 MB").
7. THE Frontend SHALL allow a User to navigate through all interactive controls — including the file upload button, URL input, submit button, and download button — using the Tab and Shift+Tab keys in DOM order, with each focused control displaying a visible focus indicator.
