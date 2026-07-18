import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.meenan.dev",
  base: "/",
  output: "static",
  trailingSlash: "always",
});
