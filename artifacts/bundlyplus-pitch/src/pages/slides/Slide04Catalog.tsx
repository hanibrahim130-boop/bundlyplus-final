export default function Slide04Catalog() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#FAF5F0" }}>

      {/* Top accent bar */}
      <div className="absolute" style={{ top: 0, left: 0, right: 0, height: "0.6vh", background: "linear-gradient(90deg, #E8456A, #A78BFA, #FB923C)" }} />

      {/* Section label + headline */}
      <div className="absolute" style={{ left: "7vw", top: "7vh" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontWeight: 500, fontSize: "1.5vw", color: "#E8456A", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 1.5vh 0" }}>
          Product Catalog
        </p>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "4vw", color: "#1A1A2E", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 1vh 0" }}>
          50+ services across every category.
        </h2>
        <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#6B7280", margin: 0 }}>
          Entertainment · Productivity · Gaming · Education · Creative tools
        </p>
      </div>

      {/* Category grid */}
      <div className="absolute" style={{ left: "7vw", right: "7vw", top: "30vh", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "2vw" }}>

        {/* Streaming */}
        <div style={{ background: "#fff", borderRadius: "1.5vw", padding: "2.5vh 2vw", boxShadow: "0 4px 20px #00000008" }}>
          <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "0.8vw", background: "linear-gradient(135deg, #E8456A22, #E8456A11)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5vh" }}>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.5vw", color: "#E8456A" }}>▶</span>
          </div>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.5vw", color: "#1A1A2E", margin: "0 0 1vh 0" }}>Streaming</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0" }}>Netflix</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0" }}>Shahid VIP</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: 0 }}>YouTube Premium</p>
        </div>

        {/* Music */}
        <div style={{ background: "#fff", borderRadius: "1.5vw", padding: "2.5vh 2vw", boxShadow: "0 4px 20px #00000008" }}>
          <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "0.8vw", background: "linear-gradient(135deg, #A78BFA22, #A78BFA11)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5vh" }}>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.5vw", color: "#A78BFA" }}>♪</span>
          </div>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.5vw", color: "#1A1A2E", margin: "0 0 1vh 0" }}>Music</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0" }}>Spotify Premium</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0" }}>Apple Music</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: 0 }}>Anghami</p>
        </div>

        {/* AI & Productivity */}
        <div style={{ background: "#fff", borderRadius: "1.5vw", padding: "2.5vh 2vw", boxShadow: "0 4px 20px #00000008" }}>
          <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "0.8vw", background: "linear-gradient(135deg, #FB923C22, #FB923C11)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5vh" }}>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.5vw", color: "#FB923C" }}>AI</span>
          </div>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.5vw", color: "#1A1A2E", margin: "0 0 1vh 0" }}>AI & Productivity</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0" }}>ChatGPT Plus</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0" }}>Microsoft 365</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: 0 }}>Adobe Creative</p>
        </div>

        {/* Gaming */}
        <div style={{ background: "#fff", borderRadius: "1.5vw", padding: "2.5vh 2vw", boxShadow: "0 4px 20px #00000008" }}>
          <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "0.8vw", background: "linear-gradient(135deg, #1A1A2E22, #1A1A2E11)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5vh" }}>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.5vw", color: "#1A1A2E" }}>⊞</span>
          </div>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.5vw", color: "#1A1A2E", margin: "0 0 1vh 0" }}>Gaming</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0" }}>PlayStation Plus</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0" }}>Xbox Game Pass</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: 0 }}>Nintendo Online</p>
        </div>
      </div>

      {/* Bottom stat */}
      <div className="absolute" style={{ left: "7vw", bottom: "6vh", display: "flex", alignItems: "center", gap: "4vw" }}>
        <div>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "3.5vw", color: "#E8456A", margin: 0, letterSpacing: "-0.02em" }}>50+</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#6B7280", margin: 0 }}>Active services</p>
        </div>
        <div style={{ width: "1px", height: "6vh", background: "#E5E7EB" }} />
        <div>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "3.5vw", color: "#A78BFA", margin: 0, letterSpacing: "-0.02em" }}>10+</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#6B7280", margin: 0 }}>Categories</p>
        </div>
        <div style={{ width: "1px", height: "6vh", background: "#E5E7EB" }} />
        <div>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "3.5vw", color: "#FB923C", margin: 0, letterSpacing: "-0.02em" }}>MENA</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#6B7280", margin: 0 }}>Regional focus</p>
        </div>
      </div>
    </div>
  );
}
