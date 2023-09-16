// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        nested: resolve(__dirname, "examples/knitting/index.html"),
        tile: resolve(__dirname, "examples/tileEditor/index.html"),
        pixel: resolve(__dirname, "examples/pixelArt/index.html"),
      },
    },
  },
});
