"use client";

// The signed-in APP. The prototype is served from /public/tilawah.html and rendered
// here at /home (middleware sends signed-in users from "/" to "/home" and guards
// "/home" for guests). It's framed as a phone on desktop and full-screen on mobile.

import DeviceFrame from "../_components/DeviceFrame";
import Splash from "../_components/Splash";

export default function Home() {
  return (
    <>
      <Splash />
      <DeviceFrame>
        <iframe
          src="/tilawah.html"
          title="Tilāwah"
          style={{ width: "100%", height: "100%", border: "none", display: "block", background: "#fff" }}
        />
      </DeviceFrame>
    </>
  );
}
