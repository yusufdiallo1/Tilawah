"use client";

// The signed-in APP. The prototype is a self-contained HTML document served from
// /public/tilawah.html and rendered here at /home (middleware sends signed-in users
// from "/" to "/home", and guards "/home" for guests). A floating device-preview
// toolbar (OUTSIDE the iframe) lets you view it at phone / tablet widths.
import { useState } from "react";

type Device = "full" | "ipad" | "phone";

const DEVICES: Record<Device, { w: number | null; h: number | null; label: string }> = {
  full: { w: null, h: null, label: "Full" },
  ipad: { w: 820, h: 1180, label: "iPad" },
  phone: { w: 390, h: 844, label: "iPhone" },
};

const DEVICE_ICON: Record<Device, React.ReactNode> = {
  full: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto", display: "block" }}>
      <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  ipad: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto", display: "block" }}>
      <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="19" r="0.9" fill="currentColor" />
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto", display: "block" }}>
      <rect x="6" y="2" width="12" height="20" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

export default function Home() {
  const [device, setDevice] = useState<Device>("full");
  const d = DEVICES[device];
  const framed = device !== "full";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: framed ? "flex-start" : "stretch",
        background: framed
          ? "radial-gradient(120% 120% at 50% 0%, #1a2722 0%, #0c1411 60%, #080d0b 100%)"
          : "transparent",
        overflow: "auto",
      }}
    >
      <iframe
        src="/tilawah.html"
        title="Tilāwah"
        style={
          framed
            ? {
                width: d.w!,
                height: d.h!,
                maxWidth: "100vw",
                maxHeight: "calc(100vh - 56px)",
                marginTop: 64,
                border: "none",
                borderRadius: 44,
                background: "#000",
                boxShadow:
                  "0 0 0 12px #11201b, 0 0 0 13px rgba(255,255,255,.06), 0 40px 90px -20px rgba(0,0,0,.8)",
              }
            : { position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }
        }
      />

      {/* Floating liquid-glass device toolbar — docked to the right side, vertical */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: 12,
          transform: "translateY(-50%)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: 5,
          borderRadius: 18,
          background: "rgba(255,255,255,.62)",
          backdropFilter: "blur(30px) saturate(1.7)",
          WebkitBackdropFilter: "blur(30px) saturate(1.7)",
          boxShadow:
            "0 1px 2px rgba(18,46,34,.05), 0 6px 16px -8px rgba(18,46,34,.24), inset 0 1px 0 rgba(255,255,255,.85)",
        }}
      >
        {(Object.keys(DEVICES) as Device[]).map((key) => {
          const on = key === device;
          return (
            <button
              key={key}
              onClick={() => setDevice(key)}
              title={DEVICES[key].label}
              style={{
                appearance: "none",
                border: "none",
                cursor: "pointer",
                fontFamily:
                  "ui-sans-serif, system-ui, -apple-system, 'IBM Plex Sans', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".2px",
                padding: "9px 7px",
                width: 52,
                borderRadius: 13,
                color: on ? "#fff" : "#16201d",
                background: on ? "#1ba35e" : "transparent",
                transition: "all .18s cubic-bezier(.2,.8,.2,1)",
              }}
            >
              {DEVICE_ICON[key]}
              <span style={{ display: "block", fontSize: 9, marginTop: 2, opacity: 0.9 }}>
                {DEVICES[key].label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
