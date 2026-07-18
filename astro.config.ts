import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.meenan.dev",
  base: "/",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
});
