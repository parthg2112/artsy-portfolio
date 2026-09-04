// Regenerates docs/design-references/ from the running dev server.
// usage: node scripts/shoot-references.mjs [baseUrl]   (default http://localhost:3000)
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = "docs/design-references/shreya";

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => existsSync(p));
if (!CHROME) throw new Error("Chrome not found - set the path in this script");

const ROUTES = [
  ["home", "/"],
  ["about", "/about"],
  ["contact", "/contact"],
];
const VIEWPORTS = [
  ["desktop", { width: 1440, height: 900, deviceScaleFactor: 1 }],
  ["mobile", { width: 402, height: 874, deviceScaleFactor: 3, isMobile: true }],
];

await mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-first-run", "--no-default-browser-check", "--disable-dev-shm-usage"],
});

for (const [name, path] of ROUTES) {
  for (const [label, viewport] of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    // The scroll-linked reveals need a pass down the page before they render settled.
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `${OUT}/${name}-${label}.png`, fullPage: true });
    await page.close();
    console.log(`${OUT}/${name}-${label}.png`);
  }
}

await browser.close();
