import { useRef, useState } from "react";
import { isValidPdfFile, isValidYouTubeUrl } from "../utils/validators";
import type { SummarizerState } from "../types";

interface Props {
  state: SummarizerState;
  onSubmit: (formData: FormData) => void;
}

type InputMode = "pdf" | "youtube" | "text" | null;

/* ── Professional SVG Icons ─────────────────────────────── */
const Icons = {
  pdf: (color = "currentColor") => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  youtube: (color = "currentColor") => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
    </svg>
  ),
  text: (color = "currentColor") => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  ),
  upload: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  uploadDone: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>
    </svg>
  ),
  link: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  hand: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v2"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
    </svg>
  ),
};

export function InputSection({ state, onSubmit }: Props) {
  const [mode, setMode] = useState<InputMode>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [error, setError] = useState("");
  const pdfRef = useRef<HTMLInputElement>(null);

  const busy = ["submitting","extracting","transcribing","generating"].includes(state.status);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const fd = new FormData();

    if (mode === "pdf") {
      if (!pdfFile) { setError("Please select a PDF file."); return; }
      const err = isValidPdfFile(pdfFile);
      if (err) { setError(err); return; }
      fd.append("input_type", "pdf");
      fd.append("file", pdfFile);
    } else if (mode === "youtube") {
      if (!youtubeUrl.trim()) { setError("Please enter a YouTube URL."); return; }
      if (!isValidYouTubeUrl(youtubeUrl.trim())) { setError("Invalid YouTube URL. Use https://www.youtube.com/watch?v=... format."); return; }
      fd.append("input_type", "youtube");
      fd.append("youtube_url", youtubeUrl.trim());
    } else if (mode === "text") {
      if (!textContent.trim()) { setError("Please enter some text content."); return; }
      if (textContent.trim().length < 100) { setError("Text is too short. Please enter at least 100 characters."); return; }
      fd.append("input_type", "text");
      fd.append("text_content", textContent.trim());
    } else {
      setError("Please choose an input type first.");
      return;
    }
    onSubmit(fd);
  }

  const tabs: { key: InputMode & string; icon: (c: string) => React.ReactNode; label: string }[] = [
    { key: "pdf", icon: Icons.pdf, label: "PDF" },
    { key: "youtube", icon: Icons.youtube, label: "YouTube" },
    { key: "text", icon: Icons.text, label: "Text" },
  ];

  const tabStyle = (active: boolean): React.CSSProperties => ({
    color: active ? "#fff" : "#999",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "#fafafa",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    color: "#000",
    fontSize: 15,
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit",
  };

  return (
    <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px 60px" }}>
      <div className="input-card fade-in-up">

        {/* Tab selector */}
        <div style={{
          display: "flex", gap: 4,
          background: "#f5f5f5",
          borderRadius: 14, padding: 4, marginBottom: 28,
        }}>
          {tabs.map(({ key, icon, label }) => (
            <button key={key} type="button" onClick={() => { setMode(key); setError(""); }}
              className={`tab-button ${mode === key ? 'tab-button-active' : 'tab-button-inactive'}`}
              aria-label={`Select ${label} input`}>
              {icon(mode === key ? "#fff" : "#999")} {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* PDF input */}
          {mode === "pdf" && (
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600,
                color: "#666", marginBottom: 8,
                textTransform: "uppercase", letterSpacing: "0.06em"
              }}>
                {Icons.pdf("#888")} Upload PDF Document
              </label>
              <div
                onClick={() => pdfRef.current?.click()}
                style={{
                  border: `2px dashed ${pdfFile ? "#10b981" : "rgba(0,0,0,0.12)"}`,
                  borderRadius: 16,
                  padding: "36px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: pdfFile ? "#f0fdf4" : "#fafafa",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (!pdfFile) e.currentTarget.style.borderColor = "rgba(0,0,0,0.25)"; }}
                onMouseLeave={e => { if (!pdfFile) e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; }}
              >
                <div style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}>
                  {pdfFile ? Icons.uploadDone : Icons.upload}
                </div>
                <div style={{
                  color: pdfFile ? "#10b981" : "#999",
                  fontSize: 14, fontWeight: pdfFile ? 600 : 500
                }}>
                  {pdfFile ? pdfFile.name : "Click to select a PDF file"}
                </div>
                <div style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>Max size: 20 MB</div>
              </div>
              <input ref={pdfRef} type="file" accept=".pdf" aria-label="Upload PDF file"
                style={{ display: "none" }} disabled={busy}
                onChange={e => setPdfFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {/* YouTube input */}
          {mode === "youtube" && (
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="yt-url" style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600,
                color: "#666", marginBottom: 8,
                textTransform: "uppercase", letterSpacing: "0.06em"
              }}>
                {Icons.youtube("#888")} YouTube URL
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}>{Icons.link}</span>
                <input id="yt-url" type="url" value={youtubeUrl} disabled={busy}
                  placeholder="https://www.youtube.com/watch?v=..."
                  aria-label="Enter YouTube URL"
                  onChange={e => setYoutubeUrl(e.target.value)}
                  onFocus={e => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.06)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                  style={{ ...inputStyle, paddingLeft: 42 }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#bbb", marginTop: 6 }}>
                {Icons.info} Video must have captions/subtitles enabled
              </div>
            </div>
          )}

          {/* Text input */}
          {mode === "text" && (
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="text-content" style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600,
                color: "#666", marginBottom: 8,
                textTransform: "uppercase", letterSpacing: "0.06em"
              }}>
                {Icons.text("#888")} Paste Your Text
              </label>
              <textarea
                id="text-content"
                value={textContent}
                disabled={busy}
                placeholder="Paste your article, notes, lecture transcript, or any long text here... (minimum 100 characters)"
                aria-label="Enter text content"
                onChange={e => setTextContent(e.target.value)}
                rows={12}
                onFocus={e => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.06)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                }}
              />
              <div style={{
                fontSize: 12,
                color: textContent.length >= 100 ? "#10b981" : "#bbb",
                marginTop: 6,
                textAlign: "right",
                fontWeight: textContent.length >= 100 ? 600 : 400,
              }}>
                {textContent.length} / 100 characters minimum
              </div>
            </div>
          )}

          {/* Placeholder when no mode selected */}
          {!mode && (
            <div style={{
              textAlign: "center", padding: "40px 0",
              color: "#bbb", fontSize: 15,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            }}>
              {Icons.hand}
              <span>Choose an input type above to get started</span>
            </div>
          )}

          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 12, padding: "10px 14px",
              color: "#dc2626", fontSize: 14, marginBottom: 16,
              fontWeight: 500,
              display: "flex", alignItems: "center", gap: 8,
            }} role="alert">{Icons.warning} {error}</div>
          )}

          <button type="submit" disabled={busy || !mode}
            aria-label={busy ? "Summarizing, please wait" : "Generate AI Notes"}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: busy || !mode ? "not-allowed" : "pointer",
              background: busy || !mode ? "#f5f5f5" : "#000",
              color: busy || !mode ? "#bbb" : "#fff",
              transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
              fontFamily: "inherit",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              if (!busy && mode) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
            {busy ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <span style={{
                  display: "inline-block", width: 18, height: 18,
                  border: "2.5px solid rgba(0,0,0,0.1)",
                  borderTopColor: "#000",
                  borderRadius: "50%", animation: "spin 0.8s linear infinite"
                }} />
                Generating Notes…
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Generate AI Notes {Icons.arrow}
              </span>
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .input-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }
        .tab-button {
          flex: 1;
          padding: 12px 10px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          font-family: inherit;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .tab-button-active {
          background: #000;
          color: #fff;
        }
        .tab-button-inactive {
          background: transparent;
          color: #999;
        }
        @media (max-width: 600px) {
          .input-card {
            padding: 24px 20px;
          }
          .tab-button {
            font-size: 13px;
            padding: 10px 8px;
            gap: 4px;
          }
          .tab-button svg {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </section>
  );
}
