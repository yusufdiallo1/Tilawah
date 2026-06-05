"use client";

// Handwritten splash — the word "تِلَاوَة" drawn on like ink, then fades to reveal
// the page. Uses Framer Motion to animate an SVG stroke (pathLength) as if written
// by hand. Self-dismisses; shows once per browser session.

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Splash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show once per session so it doesn't replay on every client navigation.
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("tilawah-splash")) return;
    setShow(true);
    sessionStorage.setItem("tilawah-splash", "1");
    const t = setTimeout(() => setShow(false), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7 } }}
          onClick={() => setShow(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            background: "radial-gradient(130% 130% at 50% 30%, #15211c 0%, #0a120e 60%, #060a08 100%)",
            cursor: "pointer",
          }}
        >
          <Handwriting />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Handwriting() {
  // A single calligraphic path approximating "تلاوة" written right-to-left,
  // revealed by animating the stroke. The real glyph fades in on top at the end
  // so the letterforms are crisp once the "writing" finishes.
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: [0.22, 1, 0.36, 1] as const },
        opacity: { duration: 0.2 },
      },
    },
  };

  return (
    <div style={{ display: "grid", placeItems: "center", gap: 18 }}>
      <div style={{ position: "relative", width: "min(78vw, 460px)", height: 180 }}>
        {/* The animated "ink" stroke that traces the word */}
        <motion.svg
          viewBox="0 0 460 180"
          width="100%"
          height="100%"
          initial="hidden"
          animate="visible"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <motion.path
            d="M430 70
               q-18 -34 -44 -6 q-22 26 4 40 q26 12 30 -22
               m-44 28 q-30 18 -64 8 q-30 -10 -20 -44
               m-70 36 q-36 6 -70 -8 q-26 -12 -10 -42 q14 -24 30 4
               m-94 46 q-40 0 -70 -26 q-22 -22 0 -46
               m-40 72 l0 -120"
            fill="none"
            stroke="#3ec77f"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            style={{ filter: "drop-shadow(0 4px 22px rgba(62,199,127,.45))" }}
          />
        </motion.svg>

        {/* Crisp glyph fades in once the stroke is mostly drawn */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontFamily: "'Amiri Quran', 'Scheherazade New', serif",
            fontSize: "clamp(72px, 16vw, 150px)",
            color: "#fff",
            textShadow: "0 8px 60px rgba(62,199,127,.4)",
            lineHeight: 1,
          }}
        >
          تِلَاوَة
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        style={{ fontSize: 14, letterSpacing: 3, color: "#7fae98", fontFamily: "ui-sans-serif, system-ui" }}
      >
        TILĀWAH
      </motion.div>
    </div>
  );
}
