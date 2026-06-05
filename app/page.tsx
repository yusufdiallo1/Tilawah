"use client";

// Marketing home — shown to SIGNED-OUT visitors at "/".
// Signed-in users are redirected to /home by middleware (lib/supabase/middleware.ts).
// Four sections: Hero · How it works · Features · Call to action.
// Cinematic Qurʾān background = a slow Ken-Burns mushaf image layer + an animated
// CSS/SVG calligraphy/glow layer, animated with Framer Motion.

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const GREEN = "#1ba35e";
const INK = "#0c1411";

export default function Marketing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main
      style={{
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'IBM Plex Sans', sans-serif",
        color: "#eaf3ee",
        background: INK,
        overflowX: "hidden",
      }}
    >
      {/* ===================== HERO ===================== */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          padding: "0 24px",
          overflow: "hidden",
        }}
      >
        {/* Ken-Burns mushaf image layer (graceful: a deep gradient shows if no image) */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-8%",
            y: bgY,
            scale: bgScale,
            backgroundImage:
              "linear-gradient(180deg, rgba(8,13,11,.55) 0%, rgba(8,13,11,.78) 60%, #080d0b 100%), url('/marketing/mushaf.jpg')",
            backgroundColor: "#0a1310",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.05)",
          }}
        />
        {/* Animated cinematic glow + calligraphy layer */}
        <CinematicBackdrop />

        {/* Hero copy */}
        <motion.div style={{ position: "relative", textAlign: "center", maxWidth: 880, opacity: heroFade }}>
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ fontFamily: "'Amiri Quran','Scheherazade New',serif", fontSize: "clamp(48px,11vw,120px)", lineHeight: 1, color: "#fff", textShadow: "0 8px 60px rgba(27,163,94,.35)" }}
          >
            تِلَاوَة
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, letterSpacing: "-1px", margin: "18px 0 0" }}
          >
            Read, memorize, and study the Qurʾān — together.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{ fontSize: "clamp(15px,2.2vw,19px)", color: "#a9c4b8", maxWidth: 620, margin: "16px auto 0", lineHeight: 1.6 }}
          >
            A complete muṣḥaf, recitation checking for your ḥifẓ, the classical mutūn
            library, and live ḥalaqāt with your circle — in one calm, beautiful place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}
          >
            <Cta href="/auth/login?next=/home" primary>
              Get started — it's free
            </Cta>
            <Cta href="/auth/login">Sign in</Cta>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          aria-hidden
          animate={{ y: [0, 9, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 26, fontSize: 22, color: "#7fae98" }}
        >
          ↓
        </motion.div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <Section eyebrow="How it works" title="Three steps to a steady ḥifẓ routine">
        <div style={grid3}>
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.12}>
              <div style={card}>
                <div style={stepNum}>{i + 1}</div>
                <h3 style={cardTitle}>{s.t}</h3>
                <p style={cardBody}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ===================== FEATURES ===================== */}
      <Section eyebrow="Everything in one place" title="Built for ṭullāb al-ʿilm">
        <div style={grid2}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 24px 60px -24px rgba(27,163,94,.4)" }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                style={{ ...card, display: "flex", gap: 16, alignItems: "flex-start" }}
              >
                <div style={featIcon}>{f.icon}</div>
                <div>
                  <h3 style={cardTitle}>{f.t}</h3>
                  <p style={cardBody}>{f.d}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ===================== CALL TO ACTION ===================== */}
      <section style={{ position: "relative", padding: "120px 24px 140px", textAlign: "center", overflow: "hidden" }}>
        <CinematicBackdrop subtle />
        <Reveal>
          <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Amiri Quran',serif", fontSize: "clamp(34px,7vw,64px)", color: "#fff", marginBottom: 10 }}>
              ﴾ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴿
            </div>
            <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, letterSpacing: "-.5px" }}>
              Begin today.
            </h2>
            <p style={{ color: "#a9c4b8", fontSize: 17, lineHeight: 1.6, margin: "12px 0 28px" }}>
              Create an account in seconds and join your first ḥalaqah.
            </p>
            <Cta href="/auth/login?next=/home" primary>
              Get started
            </Cta>
          </div>
        </Reveal>
      </section>

      <footer style={{ textAlign: "center", padding: "28px 24px", color: "#5d7468", fontSize: 13, borderTop: "1px solid rgba(255,255,255,.06)" }}>
        تِلَاوَة · Tilāwah — built for the sake of Allāh.
      </footer>
    </main>
  );
}

/* ---------------- reusable bits ---------------- */

function Cta({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <motion.span
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: "inline-block",
          padding: "14px 26px",
          borderRadius: 14,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          background: primary ? GREEN : "rgba(255,255,255,.06)",
          color: primary ? "#fff" : "#eaf3ee",
          border: primary ? "none" : "1px solid rgba(255,255,255,.16)",
          boxShadow: primary ? "0 14px 40px -12px rgba(27,163,94,.6)" : "none",
          backdropFilter: "blur(8px)",
        }}
      >
        {children}
      </motion.span>
    </Link>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ position: "relative", padding: "100px 24px", maxWidth: 1120, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ color: GREEN, fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, letterSpacing: "-.6px", marginTop: 10 }}>
            {title}
          </h2>
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Animated cinematic backdrop: a drifting radial glow + slowly rotating SVG arabesque.
function CinematicBackdrop({ subtle }: { subtle?: boolean }) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <motion.div
        animate={{ x: ["-10%", "12%", "-10%"], y: ["-6%", "8%", "-6%"], opacity: subtle ? [0.18, 0.3, 0.18] : [0.35, 0.55, 0.35] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          top: "10%",
          left: "30%",
          background: "radial-gradient(circle, rgba(27,163,94,.5) 0%, rgba(27,163,94,0) 65%)",
          filter: "blur(20px)",
        }}
      />
      <motion.svg
        viewBox="0 0 200 200"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", right: "-12%", top: "20%", width: 520, height: 520, opacity: subtle ? 0.05 : 0.1 }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={i}
            d="M100 20 C130 60 130 140 100 180 C70 140 70 60 100 20 Z"
            fill="none"
            stroke={GREEN}
            strokeWidth="0.6"
            transform={`rotate(${(360 / 16) * i} 100 100)`}
          />
        ))}
      </motion.svg>
    </div>
  );
}

/* ---------------- content ---------------- */

const STEPS = [
  { t: "Open the muṣḥaf", d: "Read any sūrah in a clean, page-faithful muṣḥaf with tafsīr a long-press away." },
  { t: "Recite & get checked", d: "Recite your assignment aloud — Tilāwah listens and highlights mistakes word-by-word." },
  { t: "Join a ḥalaqah", d: "Memorize live with your circle, track streaks, and keep each other accountable." },
];

const FEATURES = [
  { icon: "ق", t: "Full Qurʾān", d: "Every sūrah with translation and concise tafsīr, local-first and fast." },
  { icon: "م", t: "Mutūn library", d: "The classical ṭālib al-ʿilm mutūn — Jazariyyah, Uṣūl, and more." },
  { icon: "🎙️", t: "Recitation checking", d: "Recite aloud and see exactly where you slipped, ḥifẓ-friendly." },
  { icon: "👥", t: "Live ḥalaqāt", d: "Audio circles with a shared whiteboard, prayer-aware pauses, and chat." },
];

/* ---------------- styles ---------------- */

const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 };
const card: React.CSSProperties = {
  background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 22,
  padding: 26,
  backdropFilter: "blur(14px)",
};
const cardTitle: React.CSSProperties = { fontSize: 19, fontWeight: 700, margin: "0 0 8px", color: "#fff" };
const cardBody: React.CSSProperties = { fontSize: 15, lineHeight: 1.6, color: "#a9c4b8", margin: 0 };
const stepNum: React.CSSProperties = {
  width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center",
  background: "rgba(27,163,94,.16)", color: GREEN, fontWeight: 800, fontSize: 18, marginBottom: 16,
};
const featIcon: React.CSSProperties = {
  width: 46, height: 46, flex: "0 0 auto", borderRadius: 13, display: "grid", placeItems: "center",
  background: "rgba(27,163,94,.14)", color: GREEN, fontSize: 22, fontFamily: "'Amiri Quran',serif",
};
