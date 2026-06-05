"use client";

// DeviceFrame — on desktop/large screens, renders children inside a centered iPhone
// mockup on a dark backdrop. On real phones/tablets (≤ 900px) it fills the screen
// edge-to-edge with no bezel. Pure CSS media queries (no JS) to avoid hydration flced.

import type { ReactNode } from "react";

export default function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{css}</style>
      <div className="dev-backdrop">
        <div className="dev-frame">
          <div className="dev-notch" />
          <div className="dev-screen">{children}</div>
        </div>
      </div>
    </>
  );
}

const css = `
/* Mobile / tablet: full-bleed, no frame. */
.dev-backdrop { min-height: 100svh; background: #fff; }
.dev-frame { min-height: 100svh; }
.dev-screen { min-height: 100svh; }
.dev-notch { display: none; }

/* Desktop: center an iPhone mockup on a dark backdrop. */
@media (min-width: 901px) {
  .dev-backdrop {
    min-height: 100svh;
    display: grid;
    place-items: center;
    padding: 28px;
    background: radial-gradient(120% 120% at 50% 0%, #16231e 0%, #0b1310 55%, #070c0a 100%);
  }
  .dev-frame {
    position: relative;
    width: 414px;
    height: 896px;
    max-height: calc(100svh - 56px);
    min-height: 0;
    border-radius: 56px;
    padding: 13px;
    background: linear-gradient(160deg, #20312a, #0a120e);
    box-shadow:
      0 0 0 2px rgba(255,255,255,.08),
      0 50px 120px -28px rgba(0,0,0,.85),
      inset 0 1px 0 rgba(255,255,255,.06);
  }
  .dev-notch {
    display: block;
    position: absolute;
    top: 13px; left: 50%;
    transform: translateX(-50%);
    width: 132px; height: 28px;
    background: #060a08;
    border-radius: 0 0 18px 18px;
    z-index: 5;
  }
  .dev-screen {
    width: 100%; height: 100%;
    min-height: 0;
    border-radius: 44px;
    overflow: hidden;
    background: #fff;
  }
}
`;
