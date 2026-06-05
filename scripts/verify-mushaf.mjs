import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("scripts/shots", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 }).then(c => c.newPage());
const errors = [];
page.on("pageerror", e => errors.push(String(e)));
page.on("console", m => m.type() === "error" && errors.push(m.text()));

await page.goto("http://localhost:5173/tilawah.html", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

// open reader via openReader(), then go to page 15
await page.evaluate(() => window.openReader && window.openReader());
await page.waitForTimeout(1800);
// jump to page 15 directly
await page.evaluate(() => window.loadPage && window.loadPage(15));
await page.waitForTimeout(1800);
const p15 = await page.evaluate(() => {
  const ayls = [...document.querySelectorAll("#vflow .ayl")];
  return { count: ayls.length, refs: ayls.map(a => a.dataset.s + ":" + a.dataset.a), curPage: window.curPage };
});
console.log("Page 15 rendered:", p15.curPage, "| āyāt:", p15.refs.join(", "), "| count:", p15.count);
await page.screenshot({ path: "scripts/shots/m1-page15.png" });

// test swipe RTL: swipe RIGHT should go to NEXT page (16)
const before = await page.evaluate(() => window.curPage);
await page.evaluate(() => window.readerGo(1)); // simulate next
await page.waitForTimeout(1500);
const after = await page.evaluate(() => window.curPage);
console.log("readerGo(1):", before, "->", after, "(next page)");
await page.screenshot({ path: "scripts/shots/m2-page16.png" });

console.log("\nerrors:", errors.length); errors.slice(0,8).forEach(e=>console.log("  ✗",e));
await browser.close();
