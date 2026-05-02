export default function Slide10Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%)" }}>

      {/* Large gradient blob center */}
      <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "70vw", height: "70vh", borderRadius: "50%", background: "radial-gradient(ellipse, #E8456A18 0%, #A78BFA12 50%, transparent 80%)" }} />

      {/* Top-right accent circle */}
      <div className="absolute" style={{ right: "-5vw", top: "-5vh", width: "30vw", height: "30vw", borderRadius: "50%", background: "linear-gradient(135deg, #A78BFA22, #E8456A11)" }} />

      {/* Logo */}
      <div className="absolute" style={{ top: "6vh", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "1.2vw" }}>
        <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", background: "linear-gradient(135deg, #E8456A, #A78BFA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.8vw", color: "#fff" }}>B</span>
        </div>
        <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "2vw", color: "#fff", letterSpacing: "-0.02em" }}>BundlyPlus</span>
      </div>

      {/* Center content */}
      <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "70vw" }}>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "6vw", color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-0.04em", textWrap: "balance", margin: "0 0 2.5vh 0" }}>
          Join the future of<br />
          <span style={{ color: "#E8456A" }}>digital subscriptions</span><br />
          in MENA.
        </h2>
        <p style={{ fontFamily: "var(--font-body-family)", fontSize: "2vw", color: "#9CA3AF", margin: "0 0 5vh 0", lineHeight: 1.5 }}>
          We're building the region's largest subscription marketplace — and we're looking for partners who share our vision.
        </p>

        {/* Contact info */}
        <div style={{ display: "flex", justifyContent: "center", gap: "5vw" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>WhatsApp</p>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.8vw", color: "#25D366", margin: 0 }}>+961 76 171 003</p>
          </div>
          <div style={{ width: "1px", background: "#ffffff15" }} />
          <div>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 0.5vh 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>Website</p>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.8vw", color: "#A78BFA", margin: 0 }}>bundlyplus.com</p>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="absolute" style={{ bottom: "5vh", left: "50%", transform: "translateX(-50%)" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#4B5563", margin: 0, textAlign: "center" }}>
          50+ services · 10K+ users · WhatsApp delivery · MENA region
        </p>
      </div>
    </div>
  );
}
