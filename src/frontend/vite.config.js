import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";
import pluginRewriteAll from "vite-plugin-rewrite-all";

export default defineConfig({
  plugins: [vue2(), pluginRewriteAll()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
