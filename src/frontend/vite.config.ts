import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("vue") || id.includes("@vue") || id.includes("vue-router")) {
              return "vendor-vue";
            }
          }
          if (id.includes("/src/views/Warhammer/List/")) {
            return "view-wh-lists";
          }
          if (id.includes("/src/views/Warhammer/Edit/")) {
            if (id.includes("CreateCharacter")) {
              return "view-character-create";
            }
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
