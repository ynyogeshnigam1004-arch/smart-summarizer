import type { SummarizerState } from "../types";

/* ── Professional SVG Icons ─────────────────────────────── */
const StageIcons = {
  upload: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  extract: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  transcribe: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  generate: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.09 3.26L16 6l-2.91.74L12 10l-1.09-3.26L8 6l2.91-.74L12 2z"/><path d="M5 14l.54 1.63L7 16l-1.46.37L5 18l-.54-1.63L3 16l1.46-.37L5 14z"/><path d="M19 14l.54 1.63L21 16l-1.46.37L19 18l-.54-1.63L17 16l1.46-.37L19 14z"/>
    </svg>
  ),
};

const stages = [
  { key: "submitting", label: "Submitting request", icon: StageIcons.upload, step: 1 },
  { key: "extracting", label: "Extracting content", icon: StageIcons.extract, step: 2 },
  { key: "transcribing", label: "Transcribing audio", icon: StageIcons.transcribe, step: 2 },
  { key: "generating", label: "Generating AI notes", icon: StageIcons.generate, step: 3 },
];

const stepLabels = [
  { label: "Upload", step: 1, icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )},
  { label: "Extract", step: 2, icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    </svg>
  )},
  { label: "Generate", step: 3, icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.09 3.26L16 6l-2.91.74L12 10l-1.09-3.26L8 6l2.91-.74L12 2z"/>
    </svg>
  )},
];

export function ProgressIndicator({ state }: { state: SummarizerState }) {
  const active = ["submitting","extracting","transcribing","generating"].includes(state.status);
  if (!active) return null;

  const currentStage = stages.find(s => s.key === state.status) ?? { label: "Processing", icon: StageIcons.generate, step: 1 };
  const totalSteps = 3;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto 32px", padding: "0 24px" }}>
      <div style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 20,
        padding: "36px 32px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
      }} role="status" aria-live="polite">

        {/* Top section: icon + status */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "#f5f5f5",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#333",
            animation: "progPulse 1.5s ease-in-out infinite",
          }}>
            {currentStage.icon}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#000", marginBottom: 2 }}>
              {currentStage.label}…
            </div>
            <div style={{ fontSize: 13, color: "#999" }}>
              Step {currentStage.step} of {totalSteps} · This may take up to 30 seconds
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: i < currentStage.step ? "#000" : "#f0f0f0",
              transition: "background 0.5s",
            }} />
          ))}
        </div>

        {/* Processing stages */}
        <div style={{ display: "flex", gap: 24, justifyContent: "space-between" }}>
          {stepLabels.map((s) => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600,
              color: s.step <= currentStage.step ? "#000" : "#ccc",
              transition: "color 0.3s",
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                background: s.step < currentStage.step ? "#10b981" : s.step === currentStage.step ? "#000" : "#eee",
                color: s.step <= currentStage.step ? "#fff" : "#bbb",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
              }}>
                {s.step < currentStage.step ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : s.icon}
              </span>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>
    </div>
  );
}
