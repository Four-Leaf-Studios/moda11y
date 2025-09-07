/// <reference types="node" />

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";

function moduleInputs() {
  const dir = resolve(__dirname, "src/modules");
  const inputs: Record<string, string> = {
    "modules/index": resolve(dir, "index.ts"),
  };
  if (existsSync(dir)) {
    for (const f of readdirSync(dir)) {
      if (f === "index.ts") continue;
      if (!f.endsWith(".ts")) continue; // skip .tsx or others if any
      const name = f.slice(0, -3); // drop .ts
      inputs[`modules/${name}`] = resolve(dir, f);
    }
  }
  return inputs;
}

function copyCss() {
  return {
    name: "moda11y-copy-css",
    writeBundle(options: any) {
      const outDir = options.dir || "dist";
      const src = resolve(process.cwd(), "src/styles.css");
      if (existsSync(src)) {
        mkdirSync(outDir, { recursive: true });
        copyFileSync(src, resolve(outDir, "styles.css"));
      }
    },
  };
}

export default defineConfig({
  build: {
    lib: false, // using rollupOptions.input instead
    sourcemap: true,
    rollupOptions: {
      input: {
        // core + react adapter
        index: resolve(__dirname, "src/index.ts"),
        react: resolve(__dirname, "src/react/index.tsx"),
        // all feature modules under src/modules/
        ...moduleInputs(),
      },
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: [
        {
          dir: "dist",
          format: "es",
          entryFileNames: "[name].mjs", // preserves "modules/<file>.mjs"
        },
        {
          dir: "dist",
          format: "cjs",
          entryFileNames: "[name].cjs",
          exports: "named",
        },
      ],
    },
    minify: "esbuild",
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.build.json",
      entryRoot: "src",
      insertTypesEntry: true,
      rollupTypes: true,
    }),
    copyCss(),
  ],
});
