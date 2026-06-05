"use client";

// Marketing home — signed-out visitors at "/". Signed-in users are redirected to
// /home by middleware. Apple-style: huge type, scroll-scrubbed reveals, pinned
// sections, a real device shot of the app, restrained palette. Framer Motion throughout.

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

const GREEN = "#1ba35e";
const INK = "#05080a";
// Apple-ish easing curve as a typed tuple (Framer requires a 4-number tuple, not number[]).
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Marketing() {
  return (
    <main
      style={{
        background: INK,
        color: "#f4f7f5",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, ui-sans-serif, system-ui, 'IBM Plex Sans', sans-serif",
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <Nav />
      <Hero />
      <WordReveal />
      <DeviceShowcase />
      <FeatureGrid />
      <HalaqatPin />
      <FinalCta />
      <Footer />
    </main>
  );
}

/* ---------------- nav ---------------- */
function Nav() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px clamp(20px,5vw,56px)",
        background: "rgba(5,8,10,.6)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <span style={{ fontFamily: "'Amiri Quran',serif", fontSize: 24, color: "#fff" }}>تِلَاوَة</span>
      <Link href="/auth/login?next=/home" style={{ textDecoration: "none" }}>
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: GREEN,
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            padding: "9px 18px",
            borderRadius: 980,
            display: "inline-block",
          }}
        >
          Open app
        </motion.span>
      </Link>
    </motion.nav>
  );
}

/* ---------------- hero ---------------- */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const ayahY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section
      ref={ref}
      style={{ position: "relative", height: "100svh", display: "grid", placeItems: "center", overflow: "hidden" }}
    >
      {/* ambient glow */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", inset: 0, scale, y }}
      >
        <div
          style={{
            position: "absolute",
            width: "80vmax",
            height: "80vmax",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(27,163,94,.28) 0%, rgba(27,163,94,0) 60%)",
            filter: "blur(30px)",
          }}
        />
      </motion.div>

      {/* drifting āyah, parallax */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "16%",
          y: ayahY,
          fontFamily: "'Amiri Quran',serif",
          fontSize: "clamp(40px,8vw,110px)",
          color: "rgba(255,255,255,.06)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
      </motion.div>

      <motion.div style={{ position: "relative", textAlign: "center", padding: "0 24px", opacity }}>
        <Stagger>
          <motion.div variants={fadeUp} style={{ fontFamily: "'Amiri Quran',serif", fontSize: "clamp(64px,15vw,180px)", lineHeight: 0.9, color: "#fff", textShadow: "0 10px 80px rgba(27,163,94,.4)" }}>
            تِلَاوَة
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: "clamp(30px,6vw,68px)", fontWeight: 700, letterSpacing: "-.03em", margin: "20px 0 0", lineHeight: 1.05 }}>
            The Qurʾān, memorized<br />the way it's meant to be.
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: "clamp(16px,2.4vw,21px)", color: "#9fb3aa", maxWidth: 560, margin: "20px auto 0", lineHeight: 1.5 }}>
            Recite aloud and Tilāwah listens — checking every word against the
            muṣḥaf in real time. Plus mutūn, tafsīr, and live ḥalaqāt.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 34, flexWrap: "wrap" }}>
            <Pill href="/auth/login?next=/home" primary>Get started</Pill>
            <Pill href="/auth/login">Sign in</Pill>
          </motion.div>
        </Stagger>
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: "absolute", bottom: 28, fontSize: 13, letterSpacing: 2, color: "#6f8a7e" }}
      >
        SCROLL
      </motion.div>
    </section>
  );
}

/* ---------------- word-by-word scrubbed reveal (Apple-style statement) ---------------- */
function WordReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.4"] });
  const words =
    "Open the muṣḥaf. Recite from memory. Every slip, caught — gently — the moment it happens.".split(" ");
  return (
    <section ref={ref} style={{ padding: "26vh clamp(24px,8vw,120px)", maxWidth: 1100, margin: "0 auto" }}>
      <p style={{ fontSize: "clamp(28px,5vw,58px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.25, display: "flex", flexWrap: "wrap", gap: "0.25em" }}>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>
    </section>
  );
}
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/* ---------------- device showcase: the real app, pinned + scaling in ---------------- */
function DeviceShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [0.82, 1]), { stiffness: 120, damping: 24 });
  const rotate = useTransform(scrollYProgress, [0, 0.5], [8, 0]);
  const glow = useTransform(scrollYProgress, [0, 0.5], [0.2, 0.6]);

  return (
    <section ref={ref} style={{ position: "relative", padding: "10vh 24px 16vh", display: "grid", placeItems: "center" }}>
      <Reveal>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px,4.5vw,48px)", fontWeight: 700, letterSpacing: "-.02em", marginBottom: 8 }}>
          This is the whole app.
        </h2>
        <p style={{ textAlign: "center", color: "#9fb3aa", fontSize: 18, marginBottom: 48 }}>
          Not a screenshot — the real thing.
        </p>
      </Reveal>
      <motion.div style={{ position: "relative", scale, rotate }}>
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: -40,
            borderRadius: 80,
            background: "radial-gradient(circle, rgba(27,163,94,.5), transparent 70%)",
            filter: "blur(40px)",
            opacity: glow,
          }}
        />
        <div
          style={{
            position: "relative",
            width: 320,
            height: 660,
            maxWidth: "84vw",
            borderRadius: 52,
            padding: 11,
            background: "linear-gradient(160deg,#1c2a24,#0a120e)",
            boxShadow: "0 0 0 2px rgba(255,255,255,.08), 0 60px 120px -30px rgba(0,0,0,.9)",
          }}
        >
          <iframe
            src="/tilawah.html"
            title="Tilāwah app"
            style={{ width: "100%", height: "100%", border: "none", borderRadius: 42, background: "#fff" }}
            loading="lazy"
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- feature grid ---------------- */
function FeatureGrid() {
  return (
    <section style={{ padding: "12vh clamp(24px,6vw,80px)", maxWidth: 1180, margin: "0 auto" }}>
      <Reveal>
        <h2 style={{ fontSize: "clamp(26px,4.5vw,52px)", fontWeight: 700, letterSpacing: "-.02em", textAlign: "center", marginBottom: 14 }}>
          Everything for the ṭālib.
        </h2>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18, marginTop: 48 }}>
        {FEATURES.map((f, i) => (
          <Reveal key={f.t} delay={i * 0.07}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={card}
            >
              <div style={iconBox}>{f.icon}</div>
              <h3 style={{ fontSize: 21, fontWeight: 700, margin: "20px 0 8px" }}>{f.t}</h3>
              <p style={{ color: "#9fb3aa", fontSize: 15.5, lineHeight: 1.6, margin: 0 }}>{f.d}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- pinned ḥalaqāt statement ---------------- */
function HalaqatPin() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  return (
    <section ref={ref} style={{ height: "200vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100svh", display: "grid", placeItems: "center", overflow: "hidden" }}>
        <motion.div style={{ opacity, scale, textAlign: "center", padding: "0 24px", maxWidth: 760 }}>
          <div style={{ color: GREEN, fontWeight: 700, letterSpacing: 2, fontSize: 13, textTransform: "uppercase", marginBottom: 18 }}>
            Ḥalaqāt
          </div>
          <h2 style={{ fontSize: "clamp(32px,6vw,72px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.08 }}>
            Memorize together.<br />Never alone.
          </h2>
          <p style={{ color: "#9fb3aa", fontSize: 19, lineHeight: 1.6, marginTop: 22 }}>
            Live audio circles with your brothers — a shared whiteboard,
            prayer-aware pauses, streaks, and a host who keeps everyone on pace.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- final CTA ---------------- */
function FinalCta() {
  return (
    <section style={{ position: "relative", padding: "16vh 24px", textAlign: "center", overflow: "hidden" }}>
      <motion.div
        aria-hidden
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 60%, rgba(27,163,94,.3), transparent 60%)" }}
      />
      <Reveal>
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "'Amiri Quran',serif", fontSize: "clamp(40px,8vw,90px)", color: "#fff", marginBottom: 18 }}>
            ﴾ اقْرَأْ ﴿
          </div>
          <h2 style={{ fontSize: "clamp(30px,5vw,56px)", fontWeight: 700, letterSpacing: "-.02em" }}>Begin today.</h2>
          <p style={{ color: "#9fb3aa", fontSize: 18, margin: "14px 0 32px" }}>Free to start. Your circle is waiting.</p>
          <Pill href="/auth/login?next=/home" primary big>Get started</Pill>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "32px 24px", color: "#5f7569", fontSize: 13, borderTop: "1px solid rgba(255,255,255,.06)" }}>
      تِلَاوَة · Tilāwah — built for the sake of Allāh.
    </footer>
  );
}

/* ---------------- primitives ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};
function Stagger({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
      {children}
    </motion.div>
  );
}
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
function Pill({ href, children, primary, big }: { href: string; children: React.ReactNode; primary?: boolean; big?: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        style={{
          display: "inline-block",
          padding: big ? "16px 36px" : "13px 26px",
          borderRadius: 980,
          fontWeight: 600,
          fontSize: big ? 17 : 15,
          background: primary ? GREEN : "rgba(255,255,255,.08)",
          color: primary ? "#fff" : "#f4f7f5",
          border: primary ? "none" : "1px solid rgba(255,255,255,.18)",
          boxShadow: primary ? "0 16px 44px -12px rgba(27,163,94,.6)" : "none",
        }}
      >
        {children}
      </motion.span>
    </Link>
  );
}

const card: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(255,255,255,.05), rgba(255,255,255,.02))",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 26,
  padding: 28,
};
const iconBox: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 15,
  display: "grid",
  placeItems: "center",
  background: "rgba(27,163,94,.16)",
  color: GREEN,
  fontSize: 26,
  fontFamily: "'Amiri Quran',serif",
};

const FEATURES = [
  { icon: "🎙️", t: "Live recitation check", d: "Recite from memory; the blank muṣḥaf fills word-by-word and flags every slip in real time." },
  { icon: "ق", t: "The full Qurʾān", d: "A page-faithful muṣḥaf with translation and concise tafsīr, a long-press away." },
  { icon: "م", t: "Mutūn library", d: "The classical ṭālib al-ʿilm texts — Jazariyyah, Uṣūl, and more — to read and memorize." },
  { icon: "👥", t: "Live ḥalaqāt", d: "Audio circles with a shared whiteboard, streaks, and prayer-aware pauses." },
];
