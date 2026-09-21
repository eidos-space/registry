import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://plugins.eidos.space",
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
  }),
});
