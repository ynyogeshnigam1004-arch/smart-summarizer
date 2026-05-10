import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import "./design-tokens.css";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";

/* ── ElevenLabs-style Navigation ─────────────────────── */
function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === "/";

  return (
    <nav className="el-nav" style={{ animation: "navFadeIn 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
      <a
        className="el-nav-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        <span className="gemini-text" style={{ paddingBottom: 0 }}>Smart Summarizer</span>
      </a>

      {isLanding && (
        <div className="el-nav-links">
          <a href="#how-it-works">How It Works</a>
        </div>
      )}

      <div className="el-nav-cta">
        {!isLanding && (
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 14,
              fontWeight: 500,
              color: "#666",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Home
          </button>
        )}
        <button className="el-nav-btn" onClick={() => navigate("/dashboard")}>
          {isLanding ? "Get started" : "Dashboard"}
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
