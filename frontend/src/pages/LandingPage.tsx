import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import "./LandingPage.css";

/* ── Scroll-reveal hook ─────────────────────────────────── */
function useScrollReveal() {
  const init = useRef(false);
  const observe = useCallback(() => {
    if (init.current) return;
    init.current = true;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".el-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => { observe(); }, [observe]);
}

/* ── SVG Icons ──────────────────────────────────────────── */
const icons = {
  doc: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  play: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  ),
  text: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  ),
  zap: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  list: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  book: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  download: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  globe: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  sparkle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z"/>
    </svg>
  ),
};

/* ── Ticker items ───────────────────────────────────────── */
const tickerItems = [
  "GPT-4 Powered", "PDF Processing", "YouTube Analysis", "Instant Notes",
  "AI Summarization", "Key Points", "Chapter Breakdown", "Multi-Format",
  "Smart Extraction", "Bullet Summaries", "Fast & Accurate", "Export Ready",
];

/* ══════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════ */
export function LandingPage() {
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <div style={{ background: "#fff", fontFamily: "var(--font)" }}>

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="el-hero">
        <div className="el-hero-badge">
          <span className="el-pulse-dot" />
          AI-POWERED SUMMARIZER
        </div>

        <h1>Turn any content into<br />structured, intelligent notes</h1>

        <p>
          Upload a PDF, paste a YouTube link, or type text directly — our AI
          extracts key points, bullet summaries, and chapter breakdowns in seconds.
        </p>

        <div className="el-hero-buttons">
          <button className="el-btn-primary" onClick={() => navigate("/dashboard")}>
            Get started free {icons.arrow}
          </button>
          <a href="#how-it-works" className="el-btn-outline">
            See how it works
          </a>
        </div>
      </section>

      {/* ━━━ SCROLLING TICKER ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="el-ticker-wrap">
        <div className="el-ticker">
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* ━━━ PLATFORM OVERVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="el-overview">
        <h2 className="el-reveal">One platform built for every content format</h2>

        <div className="el-overview-grid el-reveal d1">
          <div className="el-overview-item">
            <h3>Smart Processing</h3>
            <p>
              Extract and analyze content from PDFs, YouTube videos, and raw text
              with state-of-the-art AI models.
            </p>
          </div>
          <div className="el-overview-item">
            <h3>Intelligent Output</h3>
            <p>
              Get organized key points, concise bullet summaries, and detailed
              chapter breakdowns — ready to use instantly.
            </p>
          </div>
        </div>

        {/* Two preview cards */}
        <div className="el-preview-cards el-reveal d2">
          <div className="el-preview-card">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Mini app preview - Input */}
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 12 }}>📄 Upload & Process</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {["PDF", "YouTube", "Text"].map((t) => (
                    <span key={t} style={{
                      padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                      background: t === "PDF" ? "#000" : "#f5f5f5",
                      color: t === "PDF" ? "#fff" : "#666"
                    }}>{t}</span>
                  ))}
                </div>
                <div style={{ background: "#fafafa", borderRadius: 8, padding: 16, border: "1px dashed rgba(0,0,0,0.12)", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>📎</div>
                  <div style={{ fontSize: 13, color: "#999" }}>Drop your file here</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#999" }}>Smart Input Interface</div>
            </div>
          </div>

          <div className="el-preview-card">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Mini app preview - Output */}
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 12 }}>✨ Generated Notes</div>
                {[
                  { label: "Key Points", val: "5 extracted", color: "#10b981" },
                  { label: "Bullet Summary", val: "8 bullets", color: "#3b82f6" },
                  { label: "Chapters", val: "3 sections", color: "#8b5cf6" },
                ].map((r) => (
                  <div key={r.label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.04)"
                  }}>
                    <span style={{ fontSize: 13, color: "#444" }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: r.color, background: `${r.color}15`, padding: "4px 10px", borderRadius: 999 }}>{r.val}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "#999" }}>Structured Output Preview</div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SMART INPUT SECTION (ElevenCreative-style) ━━━ */}
      <section className="el-product">
        <div className="el-product-header el-reveal">
          <div>
            <div className="el-product-label">Smart Input</div>
            <h2>Upload, paste, or type —<br />we handle the rest</h2>
            <div style={{ marginTop: 24 }}>
              <button className="el-btn-primary" onClick={() => navigate("/dashboard")}>
                Get started {icons.arrow}
              </button>
            </div>
          </div>
          <p>
            Process any content format with AI precision. Upload PDF documents,
            paste YouTube links for automatic transcription, or type text directly.
            Our AI handles extraction, analysis, and structuring automatically.
          </p>
        </div>

        {/* Two large feature cards */}
        <div className="el-cards-row el-reveal d1">
          {/* Dark card - PDF */}
          <div className="el-card-dark gradient-teal">
            <div className="el-card-content">
              <div className="el-card-mockup">
                <div className="mock-doc">
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    {icons.doc} <span>research_paper.pdf</span>
                  </div>
                  <div className="mock-doc-line long" />
                  <div className="mock-doc-line medium" />
                  <div className="mock-doc-line highlight long" />
                  <div className="mock-doc-line short" />
                  <div className="mock-doc-line long" />
                  <div className="mock-doc-line highlight medium" />
                  <div className="mock-doc-line short" />
                  <div style={{ height: 12 }} />
                  <div className="mock-doc-line long" />
                  <div className="mock-doc-line highlight short" />
                  <div className="mock-doc-line medium" />
                </div>
              </div>
              <div className="el-card-label">
                <h3>PDF Documents</h3>
                <p>Extract structured notes from any PDF — research papers, textbooks, reports, and more.</p>
              </div>
            </div>
          </div>

          {/* Light card - YouTube */}
          <div className="el-card-light">
            <div className="el-card-content">
              <div className="el-card-mockup">
                <div className="mock-video">
                  <div className="mock-video-thumb">
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(135deg, #fee2e2 0%, #fef3c7 50%, #dbeafe 100%)",
                      opacity: 0.5
                    }} />
                    <div className="mock-video-play">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><polygon points="8 5 19 12 8 19" /></svg>
                    </div>
                  </div>
                  <div className="mock-transcript-line">
                    <span className="mock-ts">0:12</span>
                    <span className="mock-txt">The key concept behind <span className="hl">neural networks</span> is...</span>
                  </div>
                  <div className="mock-transcript-line">
                    <span className="mock-ts">1:45</span>
                    <span className="mock-txt">This leads to <span className="hl">backpropagation</span>, which allows...</span>
                  </div>
                  <div className="mock-transcript-line">
                    <span className="mock-ts">3:22</span>
                    <span className="mock-txt">In practice, <span className="hl">gradient descent</span> optimizes the...</span>
                  </div>
                </div>
              </div>
              <div className="el-card-label">
                <h3>YouTube Videos</h3>
                <p>Paste any YouTube link — we transcribe and summarize the video automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Small feature cards */}
        <div className="el-small-cards el-reveal d2">
          {[
            { icon: icons.text, title: "Text Input" },
            { icon: icons.zap, title: "Auto-Detection" },
            { icon: icons.globe, title: "Multi-Language" },
            { icon: icons.sparkle, title: "AI-Powered" },
          ].map((f) => (
            <div className="el-small-card" key={f.title}>
              <div className="el-sc-icon">{f.icon}</div>
              <div className="el-sc-title">{f.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ SMART OUTPUT SECTION (ElevenAgents-style) ━━━ */}
      <section className="el-product">
        <div className="el-product-header el-reveal">
          <div>
            <div className="el-product-label">Smart Output</div>
            <h2>Structured notes,<br />delivered in seconds</h2>
            <div style={{ marginTop: 24 }}>
              <button className="el-btn-primary" onClick={() => navigate("/dashboard")}>
                Try it now {icons.arrow}
              </button>
            </div>
          </div>
          <p>
            Get beautifully organized notes with key points, concise bullet
            summaries, and detailed chapter breakdowns. Every output is structured,
            scannable, and ready to use for studying, sharing, or reference.
          </p>
        </div>

        {/* Two large feature cards (reversed layout) */}
        <div className="el-cards-row reverse el-reveal d1">
          {/* Light card - Summaries */}
          <div className="el-card-light">
            <div className="el-card-content">
              <div className="el-card-mockup">
                <div className="mock-summary">
                  <div className="mock-sum-section">
                    <div className="mock-sum-title">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Key Points
                    </div>
                    {["Machine learning fundamentals and core concepts",
                      "Supervised vs unsupervised learning approaches",
                      "Real-world applications in healthcare & finance"
                    ].map((t, i) => (
                      <div className="mock-sum-bullet" key={i}>
                        <div className="mock-sum-dot" />
                        <div className="mock-sum-text">{t}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mock-sum-section">
                    <div className="mock-sum-title">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3" y2="6"/><line x1="3" y1="12" x2="3" y2="12"/><line x1="3" y1="18" x2="3" y2="18"/></svg>
                      Bullet Summary
                    </div>
                    {["Neural networks mimic brain structure for pattern recognition",
                      "Training requires labeled data for supervised learning"
                    ].map((t, i) => (
                      <div className="mock-sum-bullet" key={i}>
                        <div className="mock-sum-dot" style={{ background: "#8b5cf6" }} />
                        <div className="mock-sum-text">{t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="el-card-label">
                <h3>Structured Summaries</h3>
                <p>Organized key points and bullet summaries, ready for study or reference.</p>
              </div>
            </div>
          </div>

          {/* Dark card - Chapter Breakdown */}
          <div className="el-card-dark gradient-purple">
            <div className="el-card-content">
              <div className="el-card-mockup">
                <div className="mock-keypoints">
                  {[
                    { ch: "Ch. 1", title: "Introduction to ML", desc: "Core concepts and history" },
                    { ch: "Ch. 2", title: "Neural Networks", desc: "Architecture and training" },
                    { ch: "Ch. 3", title: "Applications", desc: "Real-world use cases" },
                  ].map((c, i) => (
                    <div className="mock-kp-item" key={i}>
                      <div className="mock-kp-check">{icons.check}</div>
                      <div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 2 }}>{c.ch}</div>
                        <div className="mock-kp-text" style={{ fontWeight: 600, marginBottom: 2 }}>{c.title}</div>
                        <div className="mock-kp-text" style={{ fontSize: 12, opacity: 0.6 }}>{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="el-card-label">
                <h3>Chapter Breakdown</h3>
                <p>Automatic chapter detection with per-section summaries and key takeaways.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Small feature cards */}
        <div className="el-small-cards cols-3 el-reveal d2">
          {[
            { icon: icons.list, title: "Bullet Points" },
            { icon: icons.download, title: "Export & Share" },
            { icon: icons.book, title: "Chapter Detection" },
          ].map((f) => (
            <div className="el-small-card" key={f.title}>
              <div className="el-sc-icon">{f.icon}</div>
              <div className="el-sc-title">{f.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="how-it-works" style={{ padding: "0 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="el-how el-reveal">
          <h2>How it works</h2>
          <div className="el-how-steps">
            {[
              { num: "1", title: "Upload Content", desc: "Drop a PDF, paste a YouTube URL, or type your text directly into the editor." },
              { num: "2", title: "AI Processing", desc: "Our AI extracts, analyzes, and structures the content using advanced language models." },
              { num: "3", title: "Get Your Notes", desc: "Receive organized key points, bullet summaries, and chapter breakdowns instantly." },
            ].map((s) => (
              <div className="el-step" key={s.num}>
                <div className="el-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ STATS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="el-stats el-reveal">
        {[
          { num: "3+", label: "Input formats supported" },
          { num: "< 30s", label: "Average processing time" },
          { num: "98%", label: "Extraction accuracy" },
          { num: "∞", label: "Notes you can generate" },
        ].map((s) => (
          <div className="el-stat" key={s.label}>
            <h3>{s.num}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="el-cta el-reveal">
        <h2>The smartest AI summarizer platform</h2>
        <p>Start transforming your content into structured, actionable notes today.</p>
        <div className="el-cta-buttons">
          <button className="el-btn-primary" onClick={() => navigate("/dashboard")}>
            Get started free {icons.arrow}
          </button>
          <a href="#how-it-works" className="el-btn-outline">Learn more</a>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="el-footer">
        <div className="el-footer-grid">
          <div className="el-footer-brand">
            <h3>Smart Summarizer</h3>
            <p>AI-powered content summarization platform. Transform PDFs, YouTube videos, and text into structured, intelligent notes.</p>
          </div>
          <div className="el-footer-col">
            <h4>Product</h4>
            <a href="#how-it-works">How It Works</a>
            <a onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>Dashboard</a>
            <a href="#">API</a>
          </div>
          <div className="el-footer-col">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Blog</a>
            <a href="#">Help Center</a>
          </div>
          <div className="el-footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="el-footer-bottom">
          <span>© 2026 Smart Summarizer. All rights reserved.</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="el-pulse-dot" /> Operational
          </span>
        </div>
      </footer>
    </div>
  );
}
