/// <reference types="node" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// map the *package id* to your local sources so HMR works without publishing
export default defineConfig({
  root: resolve(__dirname),
  plugins: [react()],
  resolve: {
    alias: [
      // SUBPATHS FIRST (so they match before the generic alias)
      {
        find: "@four-leaf-studios/moda11y/react",
        replacement: resolve(__dirname, "../src/react/index.tsx"),
      },
      {
        find: "@four-leaf-studios/moda11y/modules/",
        replacement: resolve(__dirname, "../src/modules/"),
      },
      {
        find: "@four-leaf-studios/moda11y/modules",
        replacement: resolve(__dirname, "../src/modules/index.ts"),
      },
      {
        find: "@four-leaf-studios/moda11y/styles.css",
        replacement: resolve(__dirname, "../src/styles.css"),
      },
      // finally, the root entry
      {
        find: "@four-leaf-studios/moda11y",
        replacement: resolve(__dirname, "../src/index.ts"),
      },
    ],
  },
  server: { port: 5174, open: true },
});
