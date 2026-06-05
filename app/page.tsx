// The prototype is a self-contained HTML document served from /public/tilawah.html.
// It renders full-bleed here as the app's root. As the BUILD-PACKAGE is executed,
// replace this with real React routes/components (Qurʾān, Mutūn, Ḥalaqāt, You).
export default function Home() {
  return (
    <iframe
      src="/tilawah.html"
      title="Tilāwah"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
}
