import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ContactSection } from "@/components/ui/ContactSection";
import dynamic from "next/dynamic";
const LanguageSwitcher = dynamic(() => import("@/components/ui/LanguageSwitcher").then(m => ({ default: m.LanguageSwitcher })), { ssr: false });

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    const role = (session.user as any).role;
    if (role === "ARCHITECT") redirect("/dashboard/architect");
    else redirect("/feed");
  }

  return (
    <main style={{ fontFamily: "DM Sans, sans-serif", background: "#F1E6D2", color: "#210706", margin: 0, padding: 0, overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px", height: 64,
        background: "rgba(241,230,210,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(33,7,6,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="ArchLink" className="logo-img" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", color: "#210706" }}>ArchLink</span>
        </div>
        <div className="hidden md:flex items-center" style={{ gap: 40 }}>
          <Link href="/architects" className="nav-link" style={{ fontSize: 13, color: "#7A6A6A", textDecoration: "none" }}>Browse Architects</Link>
          <Link href="/login" className="nav-link" style={{ fontSize: 13, color: "#7A6A6A", textDecoration: "none" }}>Sign In</Link>
          <LanguageSwitcher />
          <Link href="/signup" style={{
            background: "#210706", color: "#F1E6D2",
            padding: "11px 28px", fontSize: 11, letterSpacing: "0.12em",
            textTransform: "uppercase", textDecoration: "none",
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(33,7,6,0.75) 0%, rgba(33,7,6,0.3) 55%, rgba(33,7,6,0.1) 100%)",
        }} />
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          height: "100%", padding: "0 20px 80px",
        }}>
          <p className="hero-label" style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "#DDD0BC", marginBottom: 24 }}>
            The Architecture Marketplace
          </p>
          <h1 className="hero-title" style={{
            fontFamily: "Cormorant Garamond, serif", fontWeight: 300,
            fontSize: "clamp(48px, 7vw, 88px)", lineHeight: 0.95,
            color: "#F1E6D2", marginBottom: 28, letterSpacing: "-0.02em", maxWidth: 650,
          }}>
            Bringing Vision<br />
            <span style={{ fontStyle: "italic", color: "#DDD0BC" }}>Into</span> Reality
          </h1>
          <p className="hero-desc" style={{ fontSize: 15, color: "rgba(241,230,210,0.8)", maxWidth: 420, lineHeight: 1.75, marginBottom: 44 }}>
            Connect with world-class architects for your next project or grow your practice by reaching clients who value exceptional design.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: 14 }}>
            <Link href="/architects" style={{
              background: "#891D1A", color: "#F1E6D2",
              padding: "15px 36px", fontSize: 11, letterSpacing: "0.12em",
              textTransform: "uppercase", textDecoration: "none",
            }}>
              Find an Architect
            </Link>
            <Link href="/signup?role=architect" style={{
              background: "transparent", color: "#F1E6D2",
              border: "1px solid rgba(241,230,210,0.45)",
              padding: "15px 36px", fontSize: 11, letterSpacing: "0.12em",
              textTransform: "uppercase", textDecoration: "none",
            }}>
              Join as Architect
            </Link>
          </div>
        </div>
        <div className="hero-stats" style={{
          position: "absolute", right: 40, bottom: 40, zIndex: 3,
          background: "rgba(241,230,210,0.96)", backdropFilter: "blur(20px)",
          padding: "28px 40px", display: "flex", gap: 44,
          borderLeft: "3px solid #891D1A",
          boxShadow: "0 20px 60px rgba(33,7,6,0.25)",
        }}>
          {[{ n: "2,400+", l: "Architects" }, { n: "18k+", l: "Projects" }, { n: "94%", l: "Satisfaction" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 300, color: "#210706", lineHeight: 1, margin: 0 }}>{s.n}</p>
              <p style={{ fontSize: 10, color: "#7A6A6A", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6, marginBottom: 0 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO WE ARE */}
      <section style={{ padding: "110px 80px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div className="reveal-left">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#210706", color: "#F1E6D2", padding: "12px 22px", marginBottom: 44 }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 300 }}>2,400+</span>
              <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.65 }}>Verified Architects</span>
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 300, lineHeight: 1.1, marginBottom: 22 }}>
              Who <span style={{ color: "#891D1A", fontStyle: "italic" }}>We</span> Are
            </h2>
            <p style={{ color: "#7A6A6A", lineHeight: 1.85, fontSize: 14, marginBottom: 18 }}>
              At ArchLink, we understand the challenges of finding exceptional design talent. We bridge the gap between visionary architects and clients who value craft.
            </p>
            <p style={{ color: "#7A6A6A", lineHeight: 1.85, fontSize: 14, marginBottom: 44 }}>
              As the premier architecture marketplace, we have made it our mission to simplify the entire process from concept to completion.
            </p>
            <div style={{ display: "flex", gap: 52 }}>
              {[{ n: "15+", l: "Countries" }, { n: "98%", l: "Hire Rate" }].map(s => (
                <div key={s.l}>
                  <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 300, margin: 0 }}>{s.n}</p>
                  <p style={{ fontSize: 10, color: "#7A6A6A", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-right" style={{ position: "relative" }}>
            <div className="hover-zoom" style={{ overflow: "hidden", height: 500 }}>
              <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: -20, left: -20, background: "#891D1A", color: "#F1E6D2", padding: "22px 28px" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, margin: 0 }}>18,000+</p>
              <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8, marginTop: 4, marginBottom: 0 }}>Projects Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#210706", padding: "110px 80px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="reveal">
            <p style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "#891D1A", marginBottom: 14 }}>Simple Process</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 300, color: "#F1E6D2", marginBottom: 72 }}>
              How We <span style={{ fontStyle: "italic", color: "#DDD0BC" }}>Simplify</span> Your Journey
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
            {[
              { n: "01", title: "Discover", desc: "Browse curated architect profiles filtered by specialty, location, style, and budget.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700", d: "delay-1" },
              { n: "02", title: "Connect", desc: "Send direct messages, share your vision, and discuss project scope and requirements.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700", d: "delay-2" },
              { n: "03", title: "Build", desc: "Collaborate with your architect, track progress, and share reviews to help the community.", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700", d: "delay-3" },
            ].map(step => (
              <div key={step.n} className={"reveal step-card " + step.d} style={{ position: "relative", overflow: "hidden", height: 460 }}>
                <img src={step.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.38)" }} />
                <div style={{ position: "relative", zIndex: 2, padding: 36, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 60, fontWeight: 300, color: "rgba(241,230,210,0.15)", lineHeight: 1 }}>{step.n}</span>
                  <div>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, color: "#F1E6D2", marginBottom: 10 }}>{step.title}</h3>
                    <p style={{ color: "rgba(241,230,210,0.65)", fontSize: 13, lineHeight: 1.75 }}>{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section style={{ padding: "110px 80px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="reveal">
            <p style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "#891D1A", marginBottom: 14 }}>Our Advantages</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 300, marginBottom: 72 }}>
              Why <span style={{ fontStyle: "italic", color: "#891D1A" }}>Choose</span> ArchLink
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { title: "Verified Professionals", desc: "Every architect on ArchLink is verified. We check licenses, review portfolios, and confirm credentials.", img: null, d: "delay-1" },
              { title: "Real Reviews", desc: "Transparent ratings and detailed reviews from real clients. Make informed decisions.", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600", d: "delay-2" },
              { title: "No Commission", desc: "We never take a cut. Connect directly with architects and negotiate your own terms.", img: null, d: "delay-3" },
              { title: "Direct Messaging", desc: "Private, secure messaging between clients and architects. Discuss everything in one place.", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600", d: "delay-1" },
              { title: "Portfolio Showcase", desc: "Architects share their best work with beautiful portfolio pages clients can explore.", img: null, d: "delay-2" },
              { title: "Community Feed", desc: "A living community. Share projects, ask questions, and stay inspired by peers worldwide.", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600", d: "delay-3" },
            ].map((item, i) => (
              <div key={i} className={"reveal hover-lift " + item.d} style={{
                position: "relative", overflow: "hidden",
                background: item.img ? "transparent" : "white",
                border: "1px solid #DDD0BC", minHeight: 190,
              }}>
                {item.img && <img src={item.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3)" }} />}
                <div style={{ position: "relative", zIndex: 2, padding: 30 }}>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: item.img ? "#F1E6D2" : "#210706", marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ color: item.img ? "rgba(241,230,210,0.7)" : "#7A6A6A", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR ARCHITECTS */}
      <section style={{ background: "#210706", padding: "110px 80px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>
          <div className="reveal-left" style={{ position: "relative" }}>
            <div className="hover-zoom" style={{ overflow: "hidden", height: 540 }}>
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: -28, right: -28, background: "#891D1A", padding: "24px 28px", maxWidth: 260 }}>
              <p style={{ color: "#F1E6D2", fontSize: 13, lineHeight: 1.7, fontStyle: "italic", marginBottom: 10, opacity: 0.9 }}>
                "ArchLink brought me 3 new international projects in my first month."
              </p>
              <p style={{ color: "rgba(241,230,210,0.65)", fontSize: 11, margin: 0 }}>Marta Delgado, Barcelona</p>
            </div>
          </div>
          <div className="reveal-right">
            <p style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "#891D1A", marginBottom: 18 }}>For Architects</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 300, color: "#F1E6D2", marginBottom: 22, lineHeight: 1.1 }}>
              Grow Your Practice<br />
              <span style={{ fontStyle: "italic", color: "#DDD0BC" }}>On Your Terms</span>
            </h2>
            <p style={{ color: "rgba(241,230,210,0.65)", lineHeight: 1.85, fontSize: 14, marginBottom: 36 }}>
              Create a stunning portfolio, set your availability, and connect with clients who appreciate your aesthetic. No middlemen. No commissions.
            </p>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: 44 }}>
              {["Beautiful portfolio pages", "Direct client messaging", "Verified reviews and ratings", "Specialty and style tagging", "Community feed and networking"].map((f, i) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 5, height: 5, background: "#891D1A", borderRadius: "50%", flexShrink: 0 }} />
                  <span style={{ color: "rgba(241,230,210,0.75)", fontSize: 13 }}>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup?role=architect" style={{
              background: "#891D1A", color: "#F1E6D2",
              padding: "15px 36px", fontSize: 11, letterSpacing: "0.12em",
              textTransform: "uppercase", textDecoration: "none",
            }}>
              Create Your Profile
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <ContactSection />

      {/* FINAL CTA */}
      <section style={{ position: "relative", padding: "150px 80px", overflow: "hidden", textAlign: "center" }}>
        <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.18)" }} />
        <div className="reveal" style={{ position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "#DDD0BC", marginBottom: 18 }}>Ready to Begin?</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 68, fontWeight: 300, color: "#F1E6D2", marginBottom: 22, letterSpacing: "-0.02em" }}>
            Start Your Journey Today
          </h2>
          <p style={{ color: "rgba(241,230,210,0.65)", fontSize: 15, maxWidth: 460, margin: "0 auto 52px" }}>
            Join thousands of architects and clients already building extraordinary things together.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <Link href="/signup" style={{ background: "#891D1A", color: "#F1E6D2", padding: "16px 44px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>
              Find an Architect
            </Link>
            <Link href="/signup?role=architect" style={{ background: "transparent", color: "#F1E6D2", border: "1px solid rgba(241,230,210,0.35)", padding: "16px 44px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>
              Join as Architect
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#210706", padding: "56px 80px", borderTop: "1px solid rgba(241,230,210,0.08)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="ArchLink" style={{ width: 34, height: 34, objectFit: "contain" }} />
            <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, color: "#F1E6D2" }}>ArchLink</span>
          </div>
          <p style={{ color: "rgba(241,230,210,0.35)", fontSize: 12, margin: 0 }}>2025 ArchLink. All rights reserved.</p>
          <div style={{ display: "flex", gap: 28 }}>
            {["Privacy", "Terms", "Support"].map(l => (
              <a key={l} href="#" style={{ color: "rgba(241,230,210,0.45)", fontSize: 12, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: `
        function revealOnScroll() {
          document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(function(el) {
            if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('visible');
          });
        }
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();
      `}} />
    </main>
  );
}
