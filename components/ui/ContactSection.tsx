"use client";

export function ContactSection() {
  return (
    <section style={{ padding: "120px 80px", maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>
      <div>
        <p style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "#891D1A", marginBottom: 16 }}>Get In Touch</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 52, fontWeight: 300, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.01em" }}>
          Have a question<br />or <span style={{ fontStyle: "italic", color: "#891D1A" }}>feedback?</span>
        </h2>
        <p style={{ color: "#7A6A6A", lineHeight: 1.85, fontSize: 15, marginBottom: 32 }}>
          Whether you have a question about ArchLink, want to report an issue, or just want to say hello — we would love to hear from you. Send us a message and we will get back to you as soon as possible.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, background: "#210706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#F1E6D2", fontSize: 16 }}>✉</span>
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A6A6A", margin: 0 }}>Email</p>
              <p style={{ fontSize: 14, color: "#210706", margin: "2px 0 0", fontWeight: 500 }}>zaid.elyounoussi@gmail.com</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, background: "#210706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#F1E6D2", fontSize: 16 }}>⚡</span>
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A6A6A", margin: 0 }}>Response Time</p>
              <p style={{ fontSize: 14, color: "#210706", margin: "2px 0 0", fontWeight: 500 }}>Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "white", border: "1px solid #DDD0BC", padding: "48px 40px" }}>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 300, marginBottom: 32, color: "#210706" }}>Send a Message</h3>
        <form action="https://formsubmit.co/zaid.elyounoussi@gmail.com" method="POST" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <input type="hidden" name="_subject" value="New message from ArchLink website" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <div>
            <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A6A6A", display: "block", marginBottom: 8 }}>Your Name</label>
            <input
              type="text" name="name" required placeholder="John Doe"
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #DDD0BC", background: "#FDFAF6", fontSize: 14, color: "#210706", fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#891D1A")}
              onBlur={e => (e.currentTarget.style.borderColor = "#DDD0BC")}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A6A6A", display: "block", marginBottom: 8 }}>Your Email</label>
            <input
              type="email" name="email" required placeholder="you@example.com"
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #DDD0BC", background: "#FDFAF6", fontSize: 14, color: "#210706", fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#891D1A")}
              onBlur={e => (e.currentTarget.style.borderColor = "#DDD0BC")}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A6A6A", display: "block", marginBottom: 8 }}>Message</label>
            <textarea
              name="message" required placeholder="Write your message here..." rows={5}
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #DDD0BC", background: "#FDFAF6", fontSize: 14, color: "#210706", fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#891D1A")}
              onBlur={e => (e.currentTarget.style.borderColor = "#DDD0BC")}
            />
          </div>
          <button
            type="submit"
            style={{ background: "#891D1A", color: "#F1E6D2", padding: "15px 36px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#210706")}
            onMouseLeave={e => (e.currentTarget.style.background = "#891D1A")}
          >
            Send Message →
          </button>
        </form>
      </div>
    </section>
  );
}