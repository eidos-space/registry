import assert from "node:assert/strict";
import test from "node:test";
import { createPluginRegistryLoader, parsePluginRegistry } from "./plugin-registry.ts";

const validPlugin = {
  id: "eidos.chart",
  name: "Chart",
  description: "Visualize table records.",
  repo: "eidos-space/eidos-chart-plugin",
  version: "0.1.0",
  tag: "v0.1.0",
  asset: "eidos.chart-0.1.0.eidos-plugin",
  sha256: "a".repeat(64),
  preview: true,
  compatibility: "Requires Eidos Lite 0.16.0 or later.",
  icon: { paths: ["M3 3v18h18"] },
};

test("parses the public plugin registry contract", () => {
  const registry = parsePluginRegistry({ schemaVersion: 1, plugins: [validPlugin] });
  assert.equal(registry.plugins[0]?.repo, validPlugin.repo);
  assert.deepEqual(registry.plugins[0]?.icon?.paths, ["M3 3v18h18"]);
});

test("drops malformed entries instead of exposing unsafe links", () => {
  const registry = parsePluginRegistry({
    schemaVersion: 1,
    plugins: [validPlugin, { ...validPlugin, id: "bad", repo: "https://example.com" }],
  });
  assert.deepEqual(registry.plugins.map((plugin) => plugin.id), ["eidos.chart"]);
});

test("rejects unsupported registry schemas", () => {
  assert.throws(
    () => parsePluginRegistry({ schemaVersion: 2, plugins: [] }),
    /Unsupported plugin registry response/u,
  );
});

test("shares one in-flight GitHub request", async () => {
  let requestCount = 0;
  const loader = createPluginRegistryLoader({
    getCache: () => undefined,
    fetchImpl: async () => {
      requestCount += 1;
      return Response.json({ schemaVersion: 1, plugins: [validPlugin] });
    },
  });

  await Promise.all([loader(), loader()]);
  assert.equal(requestCount, 1);
});

test("returns the last successful response if a refresh fails", async () => {
  let fail = false;
  let now = 0;
  const loader = createPluginRegistryLoader({
    cacheSeconds: 1,
    getCache: () => undefined,
    now: () => now,
    fetchImpl: async () => {
      if (fail) throw new Error("offline");
      return Response.json({ schemaVersion: 1, plugins: [validPlugin] });
    },
  });

  assert.equal((await loader()).plugins[0]?.id, "eidos.chart");
  now = 2_000;
  fail = true;
  assert.equal((await loader()).plugins[0]?.id, "eidos.chart");
});
