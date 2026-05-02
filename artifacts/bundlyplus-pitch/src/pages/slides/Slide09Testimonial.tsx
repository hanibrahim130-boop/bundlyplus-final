export default function Slide09Testimonial() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(150deg, #EDE9FE 0%, #FCE7F3 60%, #FAF5F0 100%)" }}>

      {/* Large decorative quote mark */}
      <div className="absolute" style={{ left: "5vw", top: "6vh", fontFamily: "var(--font-display-family)", fontSize: "22vw", color: "#E8456A", opacity: 0.06, lineHeight: 1, userSelect: "none", fontWeight: 800 }}>
        "
      </div>

      {/* Content centered */}
      <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "72vw", textAlign: "center" }}>
        <blockquote style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "3.2vw", color: "#1A1A2E", lineHeight: 1.3, letterSpacing: "-0.02em", textWrap: "balance", margin: "0 0 5vh 0" }}>
          "I was paying separately for Netflix and Spotify every month. BundlyPlus saved me 25% and took three minutes to set up over WhatsApp."
        </blockquote>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5vw" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", background: "linear-gradient(135deg, #E8456A, #A78BFA)" }} />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.8vw", color: "#1A1A2E", margin: 0 }}>Ahmad K.</p>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#6B7280", margin: 0 }}>Customer · Beirut, Lebanon</p>
          </div>
        </div>
      </div>

      {/* Bottom accent dots */}
      <div className="absolute" style={{ bottom: "7vh", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "1vw" }}>
        <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#E8456A" }} />
        <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#A78BFA" }} />
        <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#FB923C" }} />
      </div>

      {/* Side stat */}
      <div className="absolute" style={{ right: "7vw", bottom: "12vh" }}>
        <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "4.5vw", color: "#E8456A", margin: 0, letterSpacing: "-0.03em", textAlign: "right" }}>10K+</p>
        <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#6B7280", margin: 0, textAlign: "right" }}>customers like Ahmad</p>
      </div>
    </div>
  );
}
