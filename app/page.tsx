"use client";

// Marketing landing for signed-out visitors at "/". Rendered inside a phone frame
// (DeviceFrame) on desktop, full-screen on mobile. Phone-native vertical scroll with
// Framer Motion throughout. Signed-in users are redirected to /home by middleware.

import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import DeviceFrame from "./_components/DeviceFrame";
import Splash from "./_components/Splash";

const GREEN = "#1ba35e";
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Marketing() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Splash />
      <DeviceFrame>
        <div
          ref={scrollRef}
          style={{
            height: "100%",
            overflowY: "auto",
            background: "#06100c",
            color: "#eef5f1",
            fontFamily: "-apple-system, BlinkMacSystemFont, ui-sans-serif, system-ui, 'IBM Plex Sans', sans-serif",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          <Hero />
          <Statement scrollRef={scrollRef} />
          <Features />
          <Halaqat />
          <FinalCta />
          <Footer />
        </div>
      </DeviceFrame>
    </>
  );
}

/* ---------------- hero ---------------- */
function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100%",
        height: "640px",
        display: "grid",
        placeItems: "center",
        padding: "0 26px",
        overflow: "hidden",
      }}
    >
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          top: "-12%",
          background: "radial-gradient(circle, rgba(27,163,94,.34) 0%, rgba(27,163,94,0) 62%)",
          filter: "blur(20px)",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{ opacity: { duration: 1 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
        style={{
          position: "absolute",
          top: "10%",
          fontFamily: "'Amiri Quran',serif",
          fontSize: 60,
          color: "rgba(255,255,255,.06)",
          whiteSpace: "nowrap",
        }}
      >
        تَرْتِيلًا
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.13 } } }}
        style={{ position: "relative", textAlign: "center" }}
      >
        <motion.div variants={fadeUp} style={{ fontFamily: "'Amiri Quran',serif", fontSize: 96, lineHeight: 0.9, color: "#fff", textShadow: "0 10px 70px rgba(27,163,94,.45)" }}>
          تِلَاوَة
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.02em", margin: "20px 0 0", lineHeight: 1.12 }}>
          The Qurʾān, memorized the way it&apos;s meant to be.
        </motion.h1>
        <motion.p variants={fadeUp} style={{ fontSize: 16, color: "#9fb3aa", margin: "16px auto 0", lineHeight: 1.55, maxWidth: 320 }}>
          Recite aloud — Tilāwah listens and checks every word against the
          muṣḥaf in real time.
        </motion.p>
        <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 30 }}>
          <Pill href="/auth/login?next=/home" primary>Get started — free</Pill>
          <Pill href="/auth/login">Sign in</Pill>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: "absolute", bottom: 22, fontSize: 11, letterSpacing: 2, color: "#6f8a7e" }}
      >
        SCROLL
      </motion.div>
    </section>
  );
}

/* ---------------- scrubbed word-reveal statement ---------------- */
function Statement({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollRef,
    target: ref,
    offset: ["start 0.9", "end 0.5"],
  });
  const words = "Open the muṣḥaf. Recite from memory. Every slip — caught, gently, the moment it happens.".split(" ");
  return (
    <section ref={ref} style={{ padding: "90px 28px" }}>
      <p style={{ fontSize: 27, fontWeight: 700, letterSpacing: "-.01em", lineHeight: 1.35, display: "flex", flexWrap: "wrap", gap: "0.26em" }}>
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
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/* ---------------- features ---------------- */
function Features() {
  return (
    <section style={{ padding: "30px 22px 60px" }}>
      <Reveal>
        <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", textAlign: "center", marginBottom: 26 }}>
          Everything for the ṭālib.
        </h2>
      </Reveal>
      <div style={{ display: "grid", gap: 13 }}>
        {FEATURES.map((f, i) => (
          <Reveal key={f.t} delay={i * 0.06}>
            <motion.div whileTap={{ scale: 0.98 }} style={card}>
              <div style={iconBox}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 4px" }}>{f.t}</h3>
                <p style={{ color: "#9fb3aa", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{f.d}</p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- ḥalaqāt ---------------- */
function Halaqat() {
  return (
    <section style={{ position: "relative", padding: "70px 28px", textAlign: "center", overflow: "hidden" }}>
      <motion.div
        aria-hidden
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity }}
        style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(27,163,94,.26), transparent 60%)" }}
      />
      <Reveal>
        <div style={{ position: "relative" }}>
          <div style={{ color: GREEN, fontWeight: 700, letterSpacing: 2, fontSize: 12, textTransform: "uppercase", marginBottom: 14 }}>Ḥalaqāt</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.1 }}>
            Memorize together.<br />Never alone.
          </h2>
          <p style={{ color: "#9fb3aa", fontSize: 15.5, lineHeight: 1.6, marginTop: 16, maxWidth: 320, marginInline: "auto" }}>
            Live audio circles with your brothers — a shared whiteboard,
            prayer-aware pauses, streaks, and a host who keeps everyone on pace.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- final CTA ---------------- */
function FinalCta() {
  return (
    <section style={{ padding: "70px 28px", textAlign: "center" }}>
      <Reveal>
        <div style={{ fontFamily: "'Amiri Quran',serif", fontSize: 64, color: "#fff", marginBottom: 12 }}>﴾ اقْرَأْ ﴿</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.02em" }}>Begin today.</h2>
        <p style={{ color: "#9fb3aa", fontSize: 15.5, margin: "12px 0 24px" }}>Free to start. Your circle is waiting.</p>
        <Pill href="/auth/login?next=/home" primary big>Get started</Pill>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "26px", color: "#5f7569", fontSize: 12, borderTop: "1px solid rgba(255,255,255,.06)" }}>
      تِلَاوَة · Tilāwah — for the sake of Allāh.
    </footer>
  );
}

/* ---------------- primitives ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
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
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={{
          display: "block",
          textAlign: "center",
          padding: big ? "15px 30px" : "14px 24px",
          borderRadius: 980,
          fontWeight: 600,
          fontSize: big ? 16 : 15,
          background: primary ? GREEN : "rgba(255,255,255,.08)",
          color: primary ? "#fff" : "#eef5f1",
          border: primary ? "none" : "1px solid rgba(255,255,255,.18)",
          boxShadow: primary ? "0 14px 40px -12px rgba(27,163,94,.6)" : "none",
        }}
      >
        {children}
      </motion.span>
    </Link>
  );
}

const card: React.CSSProperties = {
  display: "flex",
  gap: 14,
  alignItems: "flex-start",
  background: "linear-gradient(160deg, rgba(255,255,255,.05), rgba(255,255,255,.02))",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 20,
  padding: 18,
};
const iconBox: React.CSSProperties = {
  width: 44,
  height: 44,
  flex: "0 0 auto",
  borderRadius: 13,
  display: "grid",
  placeItems: "center",
  background: "rgba(27,163,94,.16)",
  color: GREEN,
  fontSize: 22,
  fontFamily: "'Amiri Quran',serif",
};

const FEATURES = [
  { icon: "🎙️", t: "Live recitation check", d: "Recite from memory; the blank muṣḥaf fills word-by-word and flags slips in real time." },
  { icon: "ق", t: "The full Qurʾān", d: "A page-faithful muṣḥaf with translation and concise tafsīr, a long-press away." },
  { icon: "م", t: "Mutūn library", d: "The classical texts — Jazariyyah, Uṣūl, and more — to read and memorize." },
  { icon: "👥", t: "Live ḥalaqāt", d: "Audio circles with a shared whiteboard, streaks, and prayer-aware pauses." },
];
