export function HeroSection() {
  return (
    <header style={{ position: "relative", overflow: "hidden", padding: "100px 24px 80px", textAlign: "center" }}>
      {/* Animated background gradient */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 100% 70% at 50% -10%, rgba(139,92,246,0.4) 0%, transparent 70%)",
        pointerEvents: "none"
      }} className="animate-pulse-glow" />
      
      {/* Floating orbs */}
      <div style={{
        position: "absolute", top: "15%", left: "10%", width: 400, height: 400,
        borderRadius: "50%", 
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        filter: "blur(80px)", 
        pointerEvents: "none"
      }} className="animate-float" />
      
      <div style={{
        position: "absolute", top: "25%", right: "10%", width: 350, height: 350,
        borderRadius: "50%", 
        background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
        filter: "blur(80px)", 
        pointerEvents: "none",
        animationDelay: "2s"
      }} className="animate-float" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(139,92,246,0.1)", 
          border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: "var(--radius-full)", 
          padding: "8px 20px",
          fontSize: 14, 
          fontWeight: 600, 
          color: "var(--primary-light)",
          marginBottom: 32, 
          letterSpacing: "0.05em",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(139,92,246,0.2)"
        }} className="fade-in-up">
          <span style={{ fontSize: 18 }}>✨</span> 
          <span>AI-POWERED SMART SUMMARIZER</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(40px, 7vw, 72px)",
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 24,
          background: "linear-gradient(135deg, #f8fafc 0%, #a78bfa 40%, #60a5fa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.02em",
          animationDelay: "0.1s"
        }} className="fade-in-up">
          Turn Any Content Into<br />
          <span style={{
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Structured Notes</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(17px, 2.5vw, 22px)",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          maxWidth: 600,
          margin: "0 auto 48px",
          fontWeight: 400,
          animationDelay: "0.2s"
        }} className="fade-in-up">
          Upload a PDF, paste a YouTube link, or enter text directly — get beautiful, structured AI notes in seconds.
        </p>

        {/* Feature pills */}
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 12, 
          justifyContent: "center",
          marginBottom: 40,
          animationDelay: "0.3s"
        }} className="fade-in-up">
          {[
            { icon: "📄", text: "PDF Documents", color: "rgba(139,92,246,0.1)" },
            { icon: "🎥", text: "YouTube Videos", color: "rgba(59,130,246,0.1)" },
            { icon: "📝", text: "Text Input", color: "rgba(139,92,246,0.1)" },
            { icon: "⚡", text: "Instant Notes", color: "rgba(59,130,246,0.1)" }
          ].map(f => (
            <span key={f.text} style={{
              background: f.color,
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "var(--radius-full)",
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-secondary)",
              backdropFilter: "blur(10px)",
              transition: "var(--transition)",
              cursor: "default"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(139,92,246,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = f.color;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              <span style={{ marginRight: 6 }}>{f.icon}</span>
              {f.text}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
          fontSize: 13,
          marginTop: 20,
          animationDelay: "0.4s"
        }} className="fade-in-up">
          <span>Scroll to explore</span>
          <div style={{
            width: 24,
            height: 36,
            border: "2px solid rgba(139,92,246,0.3)",
            borderRadius: "var(--radius-full)",
            position: "relative"
          }}>
            <div style={{
              width: 4,
              height: 8,
              background: "var(--primary)",
              borderRadius: "var(--radius-full)",
              position: "absolute",
              top: 6,
              left: "50%",
              transform: "translateX(-50%)",
              animation: "scroll-indicator 2s ease-in-out infinite"
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-indicator {
          0%, 100% { opacity: 1; top: 6px; }
          50% { opacity: 0.3; top: 18px; }
        }
      `}</style>
    </header>
  );
}
