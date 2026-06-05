import { chromium } from "playwright";
import fs from "fs";

const OUT = "scripts/shots";
fs.mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:5173";
const log = (...a) => console.log(...a);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  log("  shot:", name);
}

// 1) The prototype itself (inside the iframe). Load it directly for interaction.
log("Loading prototype…");
await page.goto(`${BASE}/tilawah.html`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await shot("01-home");

// Navigate to Qurʾān tab
log("Qurʾān tab…");
const quranTab = page.locator('.tab', { hasText: /Qur|قرآن|Qurʾān/i }).first();
await quranTab.click().catch(() => {});
await page.waitForTimeout(800);
await shot("02-quran");

// Open a surah (al-Baqarah) — click the surah list / picker if present, else evaluate loadSurah(2)
await page.evaluate(() => window.loadSurah && window.loadSurah(2)).catch(() => {});
await page.waitForTimeout(1500); // lazy-load surah text
await shot("03-surah2");

// Switch reader mode to Mutashābihāt and count highlights
log("Mutashābihāt mode…");
const res = await page.evaluate(() => {
  // try to set mode programmatically the way the UI does
  if (window.applyMutashabihat) window.applyMutashabihat(true);
  const hits = document.querySelectorAll(".ayl.mutash").length;
  return { hits, mutashKeys: window.MUTASH ? Object.keys(window.MUTASH).length : 0 };
});
log("  highlighted mutash on screen:", res.hits, "| MUTASH keys:", res.mutashKeys);
await page.waitForTimeout(500);
await shot("04-mutashabihat");

// Open meaning/tafsir sheet for an āyah
log("Meaning/tafsīr sheet…");
await page.evaluate(() => window.showTafsir && window.showTafsir(2)).catch(() => {});
await page.waitForTimeout(1500); // tafsir lazy-load
await shot("05-tafsir-sheet");

// 2) Mutūn page + PDF button
log("Mutūn matn + PDF button…");
await page.evaluate(() => window.openMatn && window.openMatn("jazari")).catch(() => {});
await page.waitForTimeout(900);
const pdf = await page.evaluate(() => {
  const b = document.getElementById("matnPdfBtn");
  return b ? { shown: getComputedStyle(b).display !== "none", href: b.getAttribute("href") } : null;
});
log("  matnPdfBtn:", JSON.stringify(pdf));
await shot("06-matn-pdf");

// 3) The React wrapper with the device toolbar
log("Device-preview toolbar (React root)…");
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await shot("07-root-full");
await page.getByRole("button", { name: "iPhone" }).click().catch(() => {});
await page.waitForTimeout(700);
await shot("08-root-phone");
await page.getByRole("button", { name: "iPad" }).click().catch(() => {});
await page.waitForTimeout(700);
await shot("09-root-ipad");

// 4) Auth login page
log("Auth login…");
await page.goto(`${BASE}/auth/login`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await shot("10-login");

log("\nConsole/page errors:", errors.length);
errors.slice(0, 12).forEach((e) => log("  ✗", e));
await browser.close();
log("\nShots in", OUT);
