export default function Slide03Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(150deg, #FAF5F0 0%, #FCE7F3 60%, #EDE9FE 100%)" }}>

      {/* Large pink shape right */}
      <div className="absolute" style={{ right: "-4vw", top: "-5vh", width: "40vw", height: "70vh", borderRadius: "30% 0 0 50%", background: "linear-gradient(160deg, #E8456A, #A78BFA)", opacity: 0.12 }} />

      {/* Section label */}
      <div className="absolute" style={{ left: "7vw", top: "8vh" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontWeight: 500, fontSize: "1.5vw", color: "#A78BFA", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
          The Solution
        </p>
      </div>

      {/* Left side — headline */}
      <div className="absolute" style={{ left: "7vw", top: "20vh", maxWidth: "45vw" }}>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "4.8vw", color: "#1A1A2E", lineHeight: 1.1, letterSpacing: "-0.03em", textWrap: "balance", marginBottom: "3vh" }}>
          One platform.<br />Every subscription.
        </h2>
        <p style={{ fontFamily: "var(--font-body-family)", fontSize: "2vw", color: "#4B5563", lineHeight: 1.6, textWrap: "pretty", marginBottom: "4vh" }}>
          BundlyPlus aggregates 50+ premium digital services — and delivers them instantly via WhatsApp.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#E8456A", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#374151", margin: 0 }}>Local payment methods — cash, bank transfer, mobile</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#A78BFA", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#374151", margin: 0 }}>Bundle pricing — save up to 30% vs. buying separately</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#FB923C", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#374151", margin: 0 }}>Arabic-first UX with full RTL support</p>
          </div>
        </div>
      </div>

      {/* Right side — platform visual */}
      <div className="absolute" style={{ right: "7vw", top: "50%", transform: "translateY(-50%)" }}>
        <div style={{ background: "#fff", borderRadius: "2vw", padding: "4vh 3.5vw", boxShadow: "0 20px 60px #E8456A1A", minWidth: "30vw" }}>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.6vw", color: "#1A1A2E", marginBottom: "2.5vh" }}>Your cart</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh", marginBottom: "3vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#374151" }}>Netflix 4K · 1 month</span>
              <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.6vw", color: "#1A1A2E" }}>$12</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#374151" }}>Spotify Premium · 1 month</span>
              <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.6vw", color: "#1A1A2E" }}>$8</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-body-family)", fontSize: "1.6vw", color: "#374151" }}>ChatGPT Plus · 1 month</span>
              <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.6vw", color: "#1A1A2E" }}>$20</span>
            </div>
          </div>
          <div style={{ height: "1px", background: "#F3F4F6", marginBottom: "2.5vh" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5vh" }}>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.8vw", color: "#1A1A2E" }}>Total</span>
            <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "2.2vw", color: "#E8456A" }}>$40</span>
          </div>
          <div style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", borderRadius: "1vw", padding: "1.8vh 2vw", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.7vw", color: "#fff", margin: 0 }}>Order via WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
