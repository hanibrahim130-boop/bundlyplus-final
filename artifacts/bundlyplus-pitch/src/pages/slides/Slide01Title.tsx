export default function Slide01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #FAF5F0 0%, #FCE7F3 40%, #EDE9FE 100%)" }}>

      {/* Large decorative circle top-right */}
      <div className="absolute" style={{ top: "-8vh", right: "-6vw", width: "38vw", height: "38vw", borderRadius: "50%", background: "linear-gradient(135deg, #E8456A22 0%, #A78BFA33 100%)" }} />

      {/* Small accent circle */}
      <div className="absolute" style={{ bottom: "18vh", left: "8vw", width: "12vw", height: "12vw", borderRadius: "50%", background: "#FB923C18" }} />

      {/* Horizontal accent line */}
      <div className="absolute" style={{ top: "6vh", left: "6vw", width: "5vw", height: "0.4vh", background: "#E8456A", borderRadius: "2px" }} />

      {/* Logo mark */}
      <div className="absolute" style={{ top: "5.5vh", left: "6vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "0.5vh" }}>
          <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "50%", background: "linear-gradient(135deg, #E8456A, #A78BFA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.6vw", color: "#fff" }}>B</span>
          </div>
          <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.8vw", color: "#1A1A2E", letterSpacing: "-0.02em" }}>BundlyPlus</span>
        </div>
      </div>

      {/* Main content — left-aligned, vertically centered */}
      <div className="absolute" style={{ left: "6vw", top: "50%", transform: "translateY(-50%)" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontWeight: 500, fontSize: "1.6vw", color: "#E8456A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2.5vh" }}>
          Investor Presentation
        </p>
        <h1 style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "6.5vw", color: "#1A1A2E", lineHeight: 1.0, letterSpacing: "-0.04em", textWrap: "balance", marginBottom: "3vh", maxWidth: "55vw" }}>
          Premium subscriptions,<br />
          <span style={{ color: "#E8456A" }}>bundled</span> and delivered.
        </h1>
        <p style={{ fontFamily: "var(--font-body-family)", fontWeight: 400, fontSize: "2vw", color: "#4B5563", maxWidth: "44vw", lineHeight: 1.5, textWrap: "pretty" }}>
          The MENA region's go-to marketplace for digital subscriptions — Netflix, Spotify, ChatGPT, and 50+ more.
        </p>
      </div>

      {/* Right side visual stack of service cards */}
      <div className="absolute" style={{ right: "6vw", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "1.8vh" }}>
        <div style={{ background: "#fff", borderRadius: "1.2vw", padding: "2vh 2.5vw", boxShadow: "0 4px 24px #E8456A18", minWidth: "22vw", display: "flex", alignItems: "center", gap: "1.5vw" }}>
          <div style={{ width: "3.8vw", height: "3.8vw", borderRadius: "0.8vw", background: "linear-gradient(135deg, #E50914, #b00610)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.4vw", color: "#fff" }}>N</span>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.6vw", color: "#1A1A2E", margin: 0 }}>Netflix 4K</p>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#6B7280", margin: 0 }}>from $12 / month</p>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "1.2vw", padding: "2vh 2.5vw", boxShadow: "0 4px 24px #A78BFA18", minWidth: "22vw", display: "flex", alignItems: "center", gap: "1.5vw" }}>
          <div style={{ width: "3.8vw", height: "3.8vw", borderRadius: "0.8vw", background: "linear-gradient(135deg, #1DB954, #17a349)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.4vw", color: "#fff" }}>S</span>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.6vw", color: "#1A1A2E", margin: 0 }}>Spotify Premium</p>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#6B7280", margin: 0 }}>from $8 / month</p>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "1.2vw", padding: "2vh 2.5vw", boxShadow: "0 4px 24px #FB923C18", minWidth: "22vw", display: "flex", alignItems: "center", gap: "1.5vw" }}>
          <div style={{ width: "3.8vw", height: "3.8vw", borderRadius: "0.8vw", background: "linear-gradient(135deg, #10A37F, #0d8a6a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.4vw", color: "#fff" }}>G</span>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.6vw", color: "#1A1A2E", margin: 0 }}>ChatGPT Plus</p>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#6B7280", margin: 0 }}>from $20 / month</p>
          </div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #E8456A, #A78BFA)", borderRadius: "1.2vw", padding: "2vh 2.5vw", minWidth: "22vw", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.6vw", color: "#fff", margin: 0 }}>+47 more services</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute" style={{ bottom: "4vh", left: "6vw", right: "6vw", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF" }}>Confidential — 2025</p>
        <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF" }}>bundlyplus.com</p>
      </div>
    </div>
  );
}
