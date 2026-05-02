export default function Slide05Stats() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%)" }}>

      {/* Subtle radial glow */}
      <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70vw", height: "70vh", borderRadius: "50%", background: "radial-gradient(ellipse, #E8456A12 0%, transparent 70%)" }} />

      {/* Section label */}
      <div className="absolute" style={{ left: "7vw", top: "8vh" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontWeight: 500, fontSize: "1.5vw", color: "#A78BFA", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
          Traction
        </p>
      </div>

      {/* Headline */}
      <div className="absolute" style={{ left: "7vw", top: "17vh" }}>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "4vw", color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0 }}>
          Real growth, real customers.
        </h2>
      </div>

      {/* Stats row */}
      <div className="absolute" style={{ left: "7vw", right: "7vw", top: "40vh", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4vw" }}>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "10vw", color: "#E8456A", margin: "0 0 1vh 0", letterSpacing: "-0.04em", lineHeight: 1 }}>10K+</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 600, fontSize: "2vw", color: "#FFFFFF", margin: "0 0 0.8vh 0" }}>Active users</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF", margin: 0 }}>Across the MENA region</p>
        </div>

        <div style={{ textAlign: "center", borderLeft: "1px solid #ffffff18", borderRight: "1px solid #ffffff18" }}>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "10vw", color: "#A78BFA", margin: "0 0 1vh 0", letterSpacing: "-0.04em", lineHeight: 1 }}>50+</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 600, fontSize: "2vw", color: "#FFFFFF", margin: "0 0 0.8vh 0" }}>Premium services</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF", margin: 0 }}>Streaming, music, AI, gaming</p>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "10vw", color: "#FB923C", margin: "0 0 1vh 0", letterSpacing: "-0.04em", lineHeight: 1 }}>30%</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 600, fontSize: "2vw", color: "#FFFFFF", margin: "0 0 0.8vh 0" }}>Average savings</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF", margin: 0 }}>vs. buying subscriptions direct</p>
        </div>
      </div>
    </div>
  );
}
