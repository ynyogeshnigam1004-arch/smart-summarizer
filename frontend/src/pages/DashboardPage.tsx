import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputSection } from "../components/InputSection";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { ErrorPanel } from "../components/ErrorPanel";
import { ResultsSection } from "../components/ResultsSection";
import { useSummarizer } from "../hooks/useSummarizer";

export function DashboardPage() {
  const { state, submit, retry } = useSummarizer();
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.status === "success") {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  }, [state.status]);

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "var(--font)" }}>
      <style>{`
        @keyframes dashFadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .dash-anim { animation: dashFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .dash-d1 { animation-delay: 0.05s; }
        .dash-d2 { animation-delay: 0.15s; }
        .dash-d3 { animation-delay: 0.25s; }
        .dashboard-main { padding: 60px 24px 80px; }
        @media (max-width: 600px) {
          .dashboard-main { padding: 30px 16px 60px; }
        }
      `}</style>

      {/* Main Content */}
      <main className="dashboard-main">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/")}
            className="dash-anim dash-d1"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: "none",
              color: "#999", fontSize: 14, fontWeight: 500,
              cursor: "pointer", padding: "0 0 32px",
              transition: "color 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#000"}
            onMouseLeave={e => e.currentTarget.style.color = "#999"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to home
          </button>

          {/* Page Title */}
          <div className="dash-anim dash-d1" style={{ marginBottom: 48 }}>
            <h1 style={{
              fontSize: "clamp(28px,4vw,42px)",
              fontWeight: 700,
              color: "#000",
              letterSpacing: "-0.03em",
              marginBottom: 10,
            }}>
              Generate Notes
            </h1>
            <p style={{ fontSize: 17, color: "#666", lineHeight: 1.6 }}>
              Upload a PDF, paste a YouTube link, or enter text to get started.
            </p>
          </div>

          {/* Input Section */}
          <div className="dash-anim dash-d2">
            <InputSection state={state} onSubmit={submit} />
          </div>

          {/* Progress Indicator */}
          <div className="dash-anim dash-d3">
            <ProgressIndicator state={state} />
          </div>

          {/* Error Panel */}
          {state.status === "error" && (
            <ErrorPanel message={state.message} isNetwork={state.isNetwork} onRetry={retry} />
          )}

          {/* Results Section */}
          {state.status === "success" && (
            <div ref={resultsRef}>
              <ResultsSection notes={state.notes} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
