export default function Slide07WhatsApp() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1A1A2E" }}>

      {/* Green WhatsApp glow */}
      <div className="absolute" style={{ right: "0", top: "0", bottom: "0", width: "50vw", background: "linear-gradient(160deg, #25D36618 0%, #128C7E10 100%)" }} />

      {/* Left content */}
      <div className="absolute" style={{ left: "7vw", top: "50%", transform: "translateY(-50%)", maxWidth: "46vw" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontWeight: 500, fontSize: "1.5vw", color: "#25D366", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 2.5vh 0" }}>
          The WhatsApp Difference
        </p>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "4.5vw", color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-0.03em", textWrap: "balance", margin: "0 0 3vh 0" }}>
          Delivery where your customers already are.
        </h2>
        <p style={{ fontFamily: "var(--font-body-family)", fontSize: "2vw", color: "#9CA3AF", lineHeight: 1.6, margin: "0 0 4vh 0" }}>
          WhatsApp has 98%+ penetration in MENA. Our ordering flow lives where customers spend their day — no app to download, no account to create.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#25D366", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#D1D5DB", margin: 0 }}>Minutes from order to credentials</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#25D366", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#D1D5DB", margin: 0 }}>Human support for every order</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#25D366", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#D1D5DB", margin: 0 }}>Cash, bank transfer, and mobile payment</p>
          </div>
        </div>
      </div>

      {/* Right — WhatsApp chat mockup */}
      <div className="absolute" style={{ right: "7vw", top: "50%", transform: "translateY(-50%)" }}>
        <div style={{ background: "#111B21", borderRadius: "2vw", padding: "3vh 2.5vw", width: "30vw", boxShadow: "0 20px 60px #00000050" }}>
          {/* Chat header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "3vh", paddingBottom: "2vh", borderBottom: "1px solid #ffffff15" }}>
            <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "50%", background: "linear-gradient(135deg, #25D366, #128C7E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "1.4vw", color: "#fff" }}>B+</span>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.6vw", color: "#fff", margin: 0 }}>BundlyPlus Support</p>
              <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#25D366", margin: 0 }}>Online</p>
            </div>
          </div>
          {/* Messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
            <div style={{ background: "#202C33", borderRadius: "0 1vw 1vw 1vw", padding: "1.5vh 1.5vw", maxWidth: "80%" }}>
              <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#E9EDEF", margin: 0 }}>Hi! I'd like to order Netflix 4K + Spotify for 1 month.</p>
            </div>
            <div style={{ background: "#005C4B", borderRadius: "1vw 0 1vw 1vw", padding: "1.5vh 1.5vw", maxWidth: "80%", alignSelf: "flex-end" }}>
              <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#E9EDEF", margin: "0 0 0.5vh 0" }}>Order confirmed! Total: $20</p>
              <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#E9EDEF", margin: 0 }}>Your credentials will be sent shortly.</p>
            </div>
            <div style={{ background: "#202C33", borderRadius: "0 1vw 1vw 1vw", padding: "1.5vh 1.5vw", maxWidth: "80%" }}>
              <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#E9EDEF", margin: 0 }}>Netflix: user@mail.com / Pass1234</p>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#8696A0", margin: "2vh 0 0 0", textAlign: "center" }}>Delivered in under 5 minutes</p>
        </div>
      </div>
    </div>
  );
}
