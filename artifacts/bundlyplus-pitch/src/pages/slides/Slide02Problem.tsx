export default function Slide02Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1A1A2E" }}>

      {/* Gradient overlay top-left */}
      <div className="absolute" style={{ top: 0, left: 0, width: "50vw", height: "60vh", background: "radial-gradient(ellipse at top left, #E8456A22 0%, transparent 70%)" }} />

      {/* Accent dot pattern — static 4x6 grid */}
      <div className="absolute" style={{ top: "8vh", right: "8vw", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1.2vw" }}>
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#E8456A44" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#E8456A44" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#E8456A44" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#E8456A44" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#E8456A44" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#E8456A44" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ffffff11" }} />
        <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#E8456A44" }} />
      </div>

      {/* Content */}
      <div className="absolute" style={{ left: "7vw", top: "12vh" }}>
        <p style={{ fontFamily: "var(--font-body-family)", fontWeight: 500, fontSize: "1.5vw", color: "#E8456A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2vh" }}>
          The Problem
        </p>
        <h2 style={{ fontFamily: "var(--font-display-family)", fontWeight: 800, fontSize: "4.8vw", color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-0.03em", textWrap: "balance", marginBottom: "5vh", maxWidth: "52vw" }}>
          Digital subscriptions are expensive and hard to manage.
        </h2>
      </div>

      {/* Pain points — three columns */}
      <div className="absolute" style={{ left: "7vw", bottom: "10vh", right: "7vw", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.5vw" }}>
        <div style={{ borderTop: "2px solid #E8456A", paddingTop: "2.5vh" }}>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "3.5vw", color: "#E8456A", margin: "0 0 1vh 0", letterSpacing: "-0.02em" }}>$180+</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 600, fontSize: "1.7vw", color: "#fff", margin: "0 0 1.5vh 0" }}>Average annual cost</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF", lineHeight: 1.5 }}>
            Users in MENA overpay for fragmented subscriptions across multiple providers.
          </p>
        </div>
        <div style={{ borderTop: "2px solid #A78BFA", paddingTop: "2.5vh" }}>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "3.5vw", color: "#A78BFA", margin: "0 0 1vh 0", letterSpacing: "-0.02em" }}>4+ apps</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 600, fontSize: "1.7vw", color: "#fff", margin: "0 0 1.5vh 0" }}>To manage subscriptions</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF", lineHeight: 1.5 }}>
            No single platform covers Netflix, Spotify, Adobe, and ChatGPT in one place.
          </p>
        </div>
        <div style={{ borderTop: "2px solid #FB923C", paddingTop: "2.5vh" }}>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "3.5vw", color: "#FB923C", margin: "0 0 1vh 0", letterSpacing: "-0.02em" }}>Limited</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontWeight: 600, fontSize: "1.7vw", color: "#fff", margin: "0 0 1.5vh 0" }}>Local payment options</p>
          <p style={{ fontFamily: "var(--font-body-family)", fontSize: "1.5vw", color: "#9CA3AF", lineHeight: 1.5 }}>
            International billing blocks millions of MENA users from accessing premium services.
          </p>
        </div>
      </div>
    </div>
  );
}
