function sanitize(msg: string): string {
  return msg
    .replace(/Traceback[\s\S]*?(?=\n\n|$)/g, "")
    .replace(/at line \d+/g, "").replace(/File "[^"]+"/g, "")
    .replace(/AIza[A-Za-z0-9_-]+/g, "[redacted]")
    .replace(/C:\\[^\s]*/g, "").replace(/\/home\/[^\s]*/g, "").replace(/\/usr\/[^\s]*/g, "")
    .trim();
}

export function ErrorPanel({ message, isNetwork, onRetry }: { message: string; isNetwork: boolean; onRetry: () => void }) {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto 32px", padding: "0 24px" }}>
      <div role="alert" style={{
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: 20,
        padding: "24px 28px",
        display: "flex", alignItems: "flex-start", gap: 16,
      }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#dc2626", marginBottom: 6, fontSize: 16 }}>Something went wrong</div>
          <div style={{ color: "#b91c1c", fontSize: 14, lineHeight: 1.6 }}>{sanitize(message)}</div>
          {isNetwork && (
            <button onClick={onRetry} aria-label="Retry the request" style={{
              marginTop: 14, padding: "8px 20px",
              background: "#000", border: "none",
              borderRadius: 999, color: "#fff",
              fontWeight: 600, fontSize: 14, cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#222"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#000"; }}
            >↺ Retry</button>
          )}
        </div>
      </div>
    </div>
  );
}
