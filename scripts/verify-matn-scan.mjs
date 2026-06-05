import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 }).then(c => c.newPage());
const errors = [];
page.on("pageerror", e => errors.push(String(e)));
await page.goto("http://localhost:5173/tilawah.html", { waitUntil: "networkidle" });
await page.waitForTimeout(700);

// open al-Jazariyyah matn
await page.evaluate(() => window.openMatn && window.openMatn("jazari"));
await page.waitForTimeout(900);
const textMode = await page.evaluate(() => ({
  scanBtn: !!document.getElementById("matnScanBtn"),
  pdfMode: window.matnPdfMode,
}));
console.log("opened jazari — Scan btn present:", textMode.scanBtn, "| pdfMode:", textMode.pdfMode);

// toggle Scan mode
await page.evaluate(() => window.toggleMatnPdf(document.getElementById("matnScanBtn")));
await page.waitForTimeout(1500);
const scan = await page.evaluate(() => {
  const ifr = document.querySelector("#vflowMatn iframe");
  return { pdfMode: window.matnPdfMode, iframeSrc: ifr ? ifr.getAttribute("src") : null, idx: window.matnIdx };
});
console.log("Scan mode:", scan.pdfMode, "| iframe:", scan.iframeSrc);
await page.screenshot({ path: "scripts/shots/n1-matn-scan.png" });

// page forward (next PDF page)
await page.evaluate(() => window.matnGo(1));
await page.waitForTimeout(1200);
const p2 = await page.evaluate(() => {
  const ifr = document.querySelector("#vflowMatn iframe");
  return ifr ? ifr.getAttribute("src") : null;
});
console.log("after matnGo(1):", p2);
await page.screenshot({ path: "scripts/shots/n2-matn-scan-p2.png" });

console.log("errors:", errors.length); errors.slice(0,6).forEach(e=>console.log("  ✗",e));
await browser.close();
