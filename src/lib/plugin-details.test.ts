import assert from "node:assert/strict";
import test from "node:test";
import { parsePluginManifest, renderPluginReadme } from "./plugin-details.ts";

const plugin = { id: "eidos.map", version: "0.1.0" };

test("summarizes the same capabilities shown by Eidos Lite", () => {
  const manifest = parsePluginManifest(
    {
      apiVersion: 1,
      id: plugin.id,
      version: plugin.version,
      browser: { workers: true, networkOrigins: ["https://tiles.example.com", "javascript:bad"] },
      views: [{ id: "map", title: "Map", context: "table", access: "read" }],
      actions: [{ id: "open", title: "Open", access: "write" }],
    },
    plugin,
  );
  assert.deepEqual(manifest?.networkOrigins, ["https://tiles.example.com"]);
  assert.equal(manifest?.views[0]?.context, "table");
  assert.equal(manifest?.actions[0]?.access, "write");
  assert.equal(manifest?.workers, true);
});

test("ignores a manifest whose package identity does not match the registry", () => {
  assert.equal(parsePluginManifest({ id: "wrong", version: "0.1.0" }, plugin), undefined);
});

test("renders repository markdown without exposing active content", () => {
  const html = renderPluginReadme(
    "# Map\n\n![Preview](assets/map.png)\n\n[Guide](docs/guide.md)\n\n<script>alert(1)</script>\n\n[x](javascript:alert(1))",
    "eidos-space/eidos-map-plugin",
  );
  assert.match(html, /raw\.githubusercontent\.com\/eidos-space\/eidos-map-plugin\/main\/assets\/map\.png/u);
  assert.match(html, /github\.com\/eidos-space\/eidos-map-plugin\/blob\/main\/docs\/guide\.md/u);
  assert.doesNotMatch(html, /<script|javascript:/u);
  assert.doesNotMatch(html, /<h1/u);
});
