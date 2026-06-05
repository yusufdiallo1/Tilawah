import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "../actions";

export const metadata = { title: "Sign in · Tilāwah" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string; next?: string; mode?: string };
}) {
  const next = searchParams.next && searchParams.next.startsWith("/") ? searchParams.next : "/home";
  const signupMode = searchParams.mode === "signup";
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background:
          "radial-gradient(130% 130% at 50% 0%, #1a2722 0%, #0c1411 60%, #080d0b 100%)",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'IBM Plex Sans', sans-serif",
      }}
    >
      <div
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
          <div style={{ fontSize: 26, fontWeight: 800, color: "#16201d", letterSpacing: "-.5px" }}>
            تِلَاوَة
          </div>
          <div style={{ fontSize: 13, color: "#5d6b66", marginTop: 4 }}>
            {signupMode ? "Create your account" : "Sign in to continue"}
          </div>
        </div>

        {searchParams.error && (
          <p style={banner("#b00020", "rgba(176,0,32,.08)")}>{searchParams.error}</p>
        )}
        {searchParams.message && (
          <p style={banner("#1ba35e", "rgba(27,163,94,.1)")}>{searchParams.message}</p>
        )}

        {/* Email / password */}
        <form>
          <input type="hidden" name="next" value={next} />
          <label style={lbl}>Email</label>
          <input name="email" type="email" required autoComplete="email" style={inp} />
          <label style={lbl}>Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            style={inp}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button formAction={signInWithEmail} style={signupMode ? btnGhost : btnPrimary}>
              Sign in
            </button>
            <button formAction={signUpWithEmail} style={signupMode ? btnPrimary : btnGhost}>
              Sign up
            </button>
          </div>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
          <span style={{ flex: 1, height: 1, background: "rgba(16,40,30,.12)" }} />
          <span style={{ fontSize: 11, color: "#9aa7a2", fontWeight: 600 }}>OR</span>
          <span style={{ flex: 1, height: 1, background: "rgba(16,40,30,.12)" }} />
        </div>

        {/* Google OAuth */}
        <form action={signInWithGoogle}>
          <input type="hidden" name="next" value={next} />
          <button type="submit" style={btnGoogle}>
            <GoogleIcon /> Continue with Google
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 12.5, color: "#5d6b66" }}>
          <a href="/" style={{ color: "#1ba35e", fontWeight: 600, textDecoration: "none" }}>
            ← Back home
          </a>
        </div>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#5d6b66",
  margin: "12px 0 6px",
};
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
const btnGoogle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  padding: "11px 0",
  borderRadius: 12,
  border: "1px solid rgba(16,40,30,.14)",
  cursor: "pointer",
  background: "#fff",
  color: "#16201d",
  fontWeight: 700,
  fontSize: 14,
};
function banner(color: string, bg: string): React.CSSProperties {
  return {
    fontSize: 12.5,
    color,
    background: bg,
    padding: "9px 12px",
    borderRadius: 10,
    marginBottom: 14,
    lineHeight: 1.4,
  };
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 4.6 29.5 2.5 24 2.5 12.1 2.5 2.5 12.1 2.5 24S12.1 45.5 24 45.5 45.5 35.9 45.5 24c0-1.2-.1-2.3-.3-3.5z" />
      <path fill="#FF3D00" d="M5.3 14.7l6.6 4.8C13.6 15.6 18.4 12.5 24 12.5c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 4.6 29.5 2.5 24 2.5 16.3 2.5 9.6 6.9 5.3 14.7z" />
      <path fill="#4CAF50" d="M24 45.5c5.4 0 10.3-2.1 14-5.5l-6.5-5.3c-2 1.4-4.6 2.3-7.5 2.3-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.5 41 16.2 45.5 24 45.5z" />
      <path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-.8 2.2-2.1 4.1-3.8 5.4l6.5 5.3c-.5.4 7-5.1 7-15.2 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
