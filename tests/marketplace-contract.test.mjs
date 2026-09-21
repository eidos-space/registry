import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the marketplace reads the GitHub plugin registry through a cached loader", async () => {
  const source = await read("src/lib/plugin-registry.ts");
  assert.match(source, /raw\.githubusercontent\.com\/eidos-space\/registry\/main\/plugins\.registry\.json/u);
  assert.match(source, /10 \* 60/u);
  assert.match(source, /caches/u);
  assert.doesNotMatch(source, /DATABASE_URL|AUTH_SECRET|BETTER_AUTH/u);
});

test("the marketplace remains a focused catalog", async () => {
  const [component, copy] = await Promise.all([
    read("src/components/MarketplacePage.astro"),
    read("src/i18n.ts"),
  ]);
  const publicSurface = `${component}\n${copy}`;
  assert.match(publicSurface, /data-plugin-search/u);
  assert.match(publicSurface, /data-plugin-filter/u);
  assert.doesNotMatch(publicSurface, /下载 Eidos Lite|Download Eidos Lite|在 Eidos Lite 中安装/u);
  assert.doesNotMatch(publicSurface, /每个条目都来自开放的 GitHub 注册表/u);
});

test("English and Chinese routes share one marketplace component", async () => {
  const [english, chinese, config] = await Promise.all([
    read("src/pages/index.astro"),
    read("src/pages/zh/index.astro"),
    read("wrangler.jsonc"),
  ]);
  assert.match(english, /MarketplacePage locale="en"/u);
  assert.match(chinese, /MarketplacePage locale="zh"/u);
  assert.match(config, /plugins\.eidos\.space/u);
});
