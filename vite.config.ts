import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist", // Output directory
    emptyOutDir: true, // Clear output directory
    rollupOptions: {
      input: {
        "content-script": "./src/content-script.ts",
        background: "./src/background.ts",
        popup: "./src/popup.ts",
      }, // Entry file
      output: {
        entryFileNames: "script/[name].js",
      },
    },
  },
  publicDir: "public",
});
