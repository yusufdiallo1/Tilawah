"use client";

// The sign-in / sign-up screen — the app's entry point at "/". Framed as a phone on
// desktop, full-bleed on mobile, with a subtle Framer Motion entrance.

import { motion } from "framer-motion";
import { signInWithEmail, signUpWithEmail } from "../auth/actions";
import DeviceFrame from "./DeviceFrame";
import Splash from "./Splash";

export default function AuthScreen({
  next,
  signupMode,
  error,
  message,
}: {
  next: string;
  signupMode: boolean;
  error?: string;
  message?: string;
}) {
  return (
    <>
      <Splash />
      <DeviceFrame>
        <div
          style={{
            minHeight: "100%",
            height: "100%",
            boxSizing: "border-box",
            display: "grid",
            placeItems: "center",
            padding: 24,
            background: "radial-gradient(130% 130% at 50% 0%, #1a2722 0%, #0c1411 60%, #080d0b 100%)",
            fontFamily: "ui-sans-serif, system-ui, -apple-system, 'IBM Plex Sans', sans-serif",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%",
              maxWidth: 380,
              padding: 28,
              borderRadius: 24,
              background: "rgba(255,255,255,.72)",
              backdropFilter: "blur(30px) saturate(1.7)",
              WebkitBackdropFilter: "blur(30px) saturate(1.7)",
              boxShadow:
                "0 1px 2px rgba(18,46,34,.05), 0 24px 60px -18px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.85)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                style={{ fontFamily: "'Amiri Quran',serif", fontSize: 40, fontWeight: 700, color: "#16201d", lineHeight: 1 }}
              >
                تِلَاوَة
              </motion.div>
              <div style={{ fontSize: 13, color: "#5d6b66", marginTop: 8 }}>
                {signupMode ? "Create your account" : "Sign in to continue"}
              </div>
            </div>

            {error && <p style={banner("#b00020", "rgba(176,0,32,.08)")}>{error}</p>}
            {message && <p style={banner("#1ba35e", "rgba(27,163,94,.1)")}>{message}</p>}

            <form>
              <input type="hidden" name="next" value={next} />
              <label style={lbl}>Email</label>
              <input name="email" type="email" required autoComplete="email" style={inp} />
              <label style={lbl}>Password</label>
              <input name="password" type="password" required minLength={6} autoComplete="current-password" style={inp} />
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <motion.button whileTap={{ scale: 0.97 }} formAction={signInWithEmail} style={signupMode ? btnGhost : btnPrimary}>
                  Sign in
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} formAction={signUpWithEmail} style={signupMode ? btnPrimary : btnGhost}>
                  Sign up
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </DeviceFrame>
    </>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#5d6b66", margin: "12px 0 6px" };
const inp: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 13px",
  borderRadius: 12,
  border: "1px solid rgba(16,40,30,.12)",
  background: "rgba(255,255,255,.7)",
  fontSize: 14,
  color: "#16201d",
  outline: "none",
};
const btnPrimary: React.CSSProperties = {
  flex: 1,
  padding: "11px 0",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  background: "#1ba35e",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
};
const btnGhost: React.CSSProperties = {
  flex: 1,
  padding: "11px 0",
  borderRadius: 12,
  border: "1px solid rgba(16,40,30,.14)",
  cursor: "pointer",
  background: "transparent",
  color: "#16201d",
  fontWeight: 700,
  fontSize: 14,
};
function banner(color: string, bg: string): React.CSSProperties {
  return { fontSize: 12.5, color, background: bg, padding: "9px 12px", borderRadius: 10, marginBottom: 14, lineHeight: 1.4 };
}
