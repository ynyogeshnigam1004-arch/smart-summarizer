import { useState } from "react";
import type { StructuredNotes } from "../types";
import { exportToPdf } from "../utils/pdfExporter";

/* ── Professional SVG Icons ─────────────────────────────── */
const Icons = {
  sparkles: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.09 3.26L16 6l-2.91.74L12 10l-1.09-3.26L8 6l2.91-.74L12 2z"/><path d="M5 14l.54 1.63L7 16l-1.46.37L5 18l-.54-1.63L3 16l1.46-.37L5 14z"/><path d="M19 14l.54 1.63L21 16l-1.46.37L19 18l-.54-1.63L17 16l1.46-.37L19 14z"/>
    </svg>
  ),
  key: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  ),
  list: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/>
    </svg>
  ),
  book: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  copy: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  check: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  download: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  target: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  layers: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  hash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  ),
};

/* ── Copy to clipboard helper ───────────────────────────── */
function formatNotesAsText(notes: StructuredNotes): string {
  let text = "── AI Generated Notes ──\n\n";
  text += "KEY POINTS\n";
  notes.key_points.forEach((p, i) => { text += `  ${i + 1}. ${p}\n`; });
  text += "\nBULLET SUMMARY\n";
  notes.bullet_summary.forEach((b, i) => { text += `  ${i + 1}. ${b}\n`; });
  if (notes.chapters?.length) {
    text += "\nCHAPTER BREAKDOWN\n";
    notes.chapters.forEach((ch, i) => {
      text += `  Chapter ${i + 1}: ${ch.title}\n  ${ch.summary}\n\n`;
    });
  }
  return text;
}

/* ── Section card component ─────────────────────────────── */
function ResultCard({ title, icon, children, accentColor = "#000" }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; accentColor?: string;
}) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 20,
      transition: "box-shadow 0.3s, transform 0.3s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.06)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.transform = "translateY(0)";
    }}
    >
      {/* Accent top bar */}
      <div style={{ height: 3, background: accentColor }} />

      {/* Header */}
      <div style={{
        padding: "20px 28px 0",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "#f5f5f5",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#333",
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>
          {title}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 28px 24px" }}>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   RESULTS SECTION
   ══════════════════════════════════════════════════════════ */
export function ResultsSection({ notes }: { notes: StructuredNotes }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatNotesAsText(notes));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px" }}>

      {/* ── Results Header ──────────────────────────────── */}
      <div className="results-header">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "#fffbeb", border: "1px solid #fde68a",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {Icons.sparkles}
          </div>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              marginBottom: 4,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#10b981",
                animation: "resultPulse 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>
                Generation complete
              </span>
            </div>
            <h2 style={{
              fontSize: 22, fontWeight: 700, color: "#000",
              letterSpacing: "-0.02em", lineHeight: 1.2,
            }}>
              Your AI Notes
            </h2>
          </div>
        </div>

        {/* Action buttons */}
        <div className="results-header-actions" style={{ display: "flex", gap: 8 }}>
          <button onClick={handleCopy}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 18px",
              background: copied ? "#f0fdf4" : "#f5f5f5",
              border: `1px solid ${copied ? "#bbf7d0" : "rgba(0,0,0,0.08)"}`,
              borderRadius: 999,
              color: copied ? "#10b981" : "#666",
              fontWeight: 600, fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}>
            {copied ? <>{Icons.check} Copied!</> : <>{Icons.copy} Copy all</>}
          </button>
          <button onClick={() => exportToPdf(notes)}
            aria-label="Download notes as PDF"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 18px",
              background: "#000",
              border: "none", borderRadius: 999,
              color: "#fff", fontWeight: 600, fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#222"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#000"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {Icons.download} Download PDF
          </button>
        </div>
      </div>

      {/* ── Stats bar ───────────────────────────────────── */}
      <div className="stats-grid">
        {[
          { label: "Key Points", value: notes.key_points.length, icon: Icons.target },
          { label: "Bullet Items", value: notes.bullet_summary.length, icon: Icons.hash },
          ...(notes.chapters?.length ? [{ label: "Chapters", value: notes.chapters.length, icon: Icons.layers }] : []),
        ].map((s) => (
          <div key={s.label} style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 14,
            padding: "18px 20px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "#f5f5f5",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#666",
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#000", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#999", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Key Points ──────────────────────────────────── */}
      <ResultCard title="Key Points" icon={Icons.key} accentColor="#000">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {notes.key_points.map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: "14px 0",
              borderBottom: i < notes.key_points.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
            }}>
              <span style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                background: "#000", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
              }}>{i + 1}</span>
              <span style={{ color: "#333", fontSize: 15, lineHeight: 1.65, paddingTop: 3 }}>{item}</span>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* ── Bullet Summary ──────────────────────────────── */}
      <ResultCard title="Bullet Summary" icon={Icons.list} accentColor="#666">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {notes.bullet_summary.map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: "12px 0",
              borderBottom: i < notes.bullet_summary.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
            }}>
              <span style={{
                flexShrink: 0, width: 7, height: 7, borderRadius: "50%",
                background: "#000", marginTop: 8,
              }} />
              <span style={{ color: "#333", fontSize: 15, lineHeight: 1.65 }}>{item}</span>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* ── Chapter Breakdown ───────────────────────────── */}
      {notes.chapters && notes.chapters.length > 0 && (
        <ResultCard title="Chapter Breakdown" icon={Icons.book} accentColor="#444">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notes.chapters.map((ch, i) => (
              <div key={i} style={{
                background: "#fafafa",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 14,
                padding: "20px",
                position: "relative",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.background = "#f5f5f5"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.background = "#fafafa"; }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 8,
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: "#fff",
                    background: "#000", borderRadius: 6,
                    padding: "3px 10px", lineHeight: 1.6,
                    letterSpacing: "0.02em",
                  }}>
                    CH. {i + 1}
                  </span>
                  <span style={{
                    fontSize: 16, fontWeight: 700, color: "#000",
                    letterSpacing: "-0.01em",
                  }}>
                    {ch.title}
                  </span>
                </div>
                <div style={{
                  color: "#555", fontSize: 14, lineHeight: 1.7,
                  paddingLeft: 2,
                }}>
                  {ch.summary}
                </div>
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      {/* ── Footer note ─────────────────────────────────── */}
      <div style={{
        textAlign: "center",
        padding: "24px 0 0",
        fontSize: 13,
        color: "#bbb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        Generated by Smart Summarizer AI · Results may vary based on input quality
      </div>

      <style>{`
        @keyframes resultPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(${notes.chapters?.length ? 3 : 2}, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .results-header {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          padding: 28px 32px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .results-header {
            padding: 24px 20px;
            flex-direction: column;
            align-items: flex-start;
          }
          .results-header-actions {
            width: 100%;
            display: flex;
            justify-content: stretch;
          }
          .results-header-actions button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
