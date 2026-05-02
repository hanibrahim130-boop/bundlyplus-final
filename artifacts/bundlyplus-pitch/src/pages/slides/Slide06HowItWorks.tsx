export default function Slide06HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#FAF5F0" }}>

      {/* Accent top bar */}
      <div className="absolute" style={{ top: 0, left: 0, right: 0, height: "0.6vh", background: "linear-gradient(90deg, #A78BFA, #E8456A, #FB923C)" }} />

      {/* Background circle */}
      <div className="absolute" style={{ right: "-8vw", bottom: "-10vh", width: "50vw", height: "50vw", borderRadius: "50%", background: "linear-gradient(135deg, #EDE9FE44, #FCE7F344)" }} />

      {/* Section label + headline */}
      <div className="absolute" style={{ left: "7vw", top: "8vh" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontWeight: 500, fontSize: "1.5vw", color: "#E8456A", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 1.5vh 0" }}>
          How It Works
        </p>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "4vw", color: "#1A1A2E", lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0 }}>
          Three steps to your subscriptions.
        </h2>
      </div>

      {/* Steps */}
      <div className="absolute" style={{ left: "7vw", right: "7vw", top: "33vh", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3vw" }}>

        {/* Step 1 */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", marginBottom: "2.5vh" }}>
            <div style={{ width: "5vw", height: "5vw", borderRadius: "50%", background: "#E8456A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "2.2vw", color: "#fff" }}>1</span>
            </div>
            <div style={{ flex: 1, height: "2px", background: "#E5E7EB" }} />
          </div>
          <h3 style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "2.2vw", color: "#1A1A2E", margin: "0 0 1.5vh 0" }}>Browse the catalog</h3>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
            Explore 50+ services by category. Filter by price, duration, or popularity.
          </p>
          <div style={{ marginTop: "2.5vh", background: "#fff", borderRadius: "1vw", padding: "2vh 1.8vw", boxShadow: "0 4px 16px #00000008" }}>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF", margin: "0 0 1vh 0" }}>Popular right now</p>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 600, fontSize: "1.6vw", color: "#1A1A2E", margin: "0 0 0.6vh 0" }}>Netflix 4K — $12/mo</p>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 600, fontSize: "1.6vw", color: "#1A1A2E", margin: 0 }}>ChatGPT Plus — $20/mo</p>
          </div>
        </div>

        {/* Step 2 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", marginBottom: "2.5vh" }}>
            <div style={{ width: "5vw", height: "5vw", borderRadius: "50%", background: "#A78BFA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "2.2vw", color: "#fff" }}>2</span>
            </div>
            <div style={{ flex: 1, height: "2px", background: "#E5E7EB" }} />
          </div>
          <h3 style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "2.2vw", color: "#1A1A2E", margin: "0 0 1.5vh 0" }}>Build your bundle</h3>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
            Add services to your cart. Mix and match — or choose a pre-built bundle at a fixed discount.
          </p>
          <div style={{ marginTop: "2.5vh", background: "#fff", borderRadius: "1vw", padding: "2vh 1.8vw", boxShadow: "0 4px 16px #00000008" }}>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF", margin: "0 0 1vh 0" }}>Your cart · 3 items</p>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.8vw", color: "#A78BFA", margin: 0 }}>Total: $40 — save 25%</p>
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5vw", marginBottom: "2.5vh" }}>
            <div style={{ width: "5vw", height: "5vw", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "2.2vw", color: "#fff" }}>3</span>
            </div>
          </div>
          <h3 style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "2.2vw", color: "#1A1A2E", margin: "0 0 1.5vh 0" }}>Order via WhatsApp</h3>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.7vw", color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
            One tap sends your order to our team. Pay locally and receive credentials within minutes.
          </p>
          <div style={{ marginTop: "2.5vh", background: "linear-gradient(135deg, #25D366, #128C7E)", borderRadius: "1vw", padding: "2vh 1.8vw" }}>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.7vw", color: "#fff", margin: 0 }}>Order on WhatsApp →</p>
          </div>
        </div>
      </div>
    </div>
  );
}
