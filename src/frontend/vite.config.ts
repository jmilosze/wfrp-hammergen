import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // "@/" is src/, for imports outside the importing file's folder.
  resolve: {
    alias: { "@": "/src" },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("vue") || id.includes("@vue") || id.includes("vue-router")) {
              return "vendor-vue";
            }
          }
          if (id.includes("/src/views/Content/List/")) {
            return "view-wh-lists";
          }
          if (id.includes("/src/views/Content/Edit/")) {
            return "view-wh-edits";
          }
          if (id.includes("/src/views/User/")) {
            return "view-user";
          }
        },
      },
    },
  },
});
