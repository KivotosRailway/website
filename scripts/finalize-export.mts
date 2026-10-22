import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isLocale, localeLanguageTags } from "../src/lib/i18n";

const output = path.resolve("out");
const bootstrap = (await readFile("public/init-theme.js", "utf8")).trim();

async function finalize(directory: string): Promise<number> {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { count += await finalize(file); continue; }
    if (!entry.name.endsWith(".html")) continue;
    const routeLocale = path.relative(output, file).split(path.sep)[0];
    const language = isLocale(routeLocale) ? localeLanguageTags[routeLocale] : "zh-Hans";
    const html = await readFile(file, "utf8");
    if (!html.includes("</head>") || !/<html\b[^>]*\blang="[^"]*"/.test(html)) {
      throw new Error(`Unexpected exported HTML: ${file}`);
    }
    // Static-host boundary: no scripts in React layouts and no extra root layouts
    // (which would turn language switching into document navigation).
    const finalized = html
      .replace(/(<html\b[^>]*\blang=")[^"]*"/, `$1${language}"`)
      .replace(/<script id="kr-theme-init">[\s\S]*?<\/script>/g, "")
      .replace("</head>", `<script id="kr-theme-init">${bootstrap}</script></head>`);
    await writeFile(file, finalized);
    count += 1;
  }
  return count;
}

console.log(`[finalize-export] Set document languages and pre-paint themes in ${await finalize(output)} HTML files.`);
