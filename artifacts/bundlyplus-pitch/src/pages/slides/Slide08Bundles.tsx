export default function Slide08Bundles() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(150deg, #FAF5F0 0%, #FCE7F3 100%)" }}>

      {/* Accent top bar */}
      <div className="absolute" style={{ top: 0, left: 0, right: 0, height: "0.6vh", background: "linear-gradient(90deg, #E8456A, #A78BFA, #FB923C)" }} />

      {/* Section label + headline */}
      <div className="absolute" style={{ left: "7vw", top: "7vh" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontWeight: 500, fontSize: "1.5vw", color: "#E8456A", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 1.5vh 0" }}>
          Bundle Pricing
        </p>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "4vw", color: "#1A1A2E", lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0 }}>
          Pre-built bundles for every need.
        </h2>
      </div>

      {/* Bundle cards */}
      <div className="absolute" style={{ left: "7vw", right: "7vw", top: "28vh", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.5vw" }}>

        {/* Bundle 1 */}
        <div style={{ background: "#fff", borderRadius: "1.8vw", padding: "3.5vh 2.5vw", boxShadow: "0 8px 30px #E8456A14" }}>
          <div style={{ marginBottom: "2.5vh" }}>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.8vw", color: "#1A1A2E", margin: "0 0 0.5vh 0" }}>Entertainment Bundle</p>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: 0 }}>Netflix + Shahid VIP + YouTube</p>
          </div>
          <div style={{ marginBottom: "2.5vh" }}>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "3.8vw", color: "#E8456A", margin: "0 0 0.3vh 0", lineHeight: 1, letterSpacing: "-0.02em" }}>$45</p>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#9CA3AF", margin: 0 }}>per month  ·  was $60</p>
          </div>
          <div style={{ height: "1px", background: "#F3F4F6", marginBottom: "2vh" }} />
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#374151", margin: "0 0 0.8vh 0" }}>Netflix 4K included</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#374151", margin: "0 0 0.8vh 0" }}>Shahid VIP ad-free</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#374151", margin: 0 }}>Full-period guarantee</p>
        </div>

        {/* Bundle 2 — featured */}
        <div style={{ background: "linear-gradient(160deg, #1A1A2E, #2D1B4E)", borderRadius: "1.8vw", padding: "3.5vh 2.5vw", boxShadow: "0 8px 40px #1A1A2E30", position: "relative", overflow: "hidden" }}>
          <div className="absolute" style={{ top: "-3vh", right: "-3vw", width: "15vw", height: "15vw", borderRadius: "50%", background: "#A78BFA15" }} />
          <div style={{ background: "#A78BFA", borderRadius: "0.6vw", padding: "0.4vh 1vw", display: "inline-block", marginBottom: "2vh" }}>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.3vw", color: "#fff", margin: 0 }}>Most Popular</p>
          </div>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.8vw", color: "#fff", margin: "0 0 0.5vh 0" }}>Sports & Movies</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#9CA3AF", margin: "0 0 2.5vh 0" }}>Shahid Sports + Netflix · 3 months</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "3.8vw", color: "#A78BFA", margin: "0 0 0.3vh 0", lineHeight: 1, letterSpacing: "-0.02em" }}>$120</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: "0 0 2vh 0" }}>3 months  ·  was $150</p>
          <div style={{ height: "1px", background: "#ffffff15", marginBottom: "2vh" }} />
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#D1D5DB", margin: "0 0 0.8vh 0" }}>Shahid Sports full package</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#D1D5DB", margin: "0 0 0.8vh 0" }}>Netflix 4K access</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#D1D5DB", margin: 0 }}>Save 20%</p>
        </div>

        {/* Bundle 3 */}
        <div style={{ background: "#fff", borderRadius: "1.8vw", padding: "3.5vh 2.5vw", boxShadow: "0 8px 30px #FB923C14" }}>
          <div style={{ marginBottom: "2.5vh" }}>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "1.8vw", color: "#1A1A2E", margin: "0 0 0.5vh 0" }}>Family Annual</p>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#6B7280", margin: 0 }}>All-in-one · full year</p>
          </div>
          <div style={{ marginBottom: "2.5vh" }}>
            <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "3.8vw", color: "#FB923C", margin: "0 0 0.3vh 0", lineHeight: 1, letterSpacing: "-0.02em" }}>$350</p>
            <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#9CA3AF", margin: 0 }}>per year  ·  was $500</p>
          </div>
          <div style={{ height: "1px", background: "#F3F4F6", marginBottom: "2vh" }} />
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#374151", margin: "0 0 0.8vh 0" }}>Netflix + Shahid + YouTube</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#374151", margin: "0 0 0.8vh 0" }}>Spotify + ChatGPT Plus</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.4vw", color: "#374151", margin: 0 }}>Save 30% vs. direct</p>
        </div>
      </div>
    </div>
  );
}
