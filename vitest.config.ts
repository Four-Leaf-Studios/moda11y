import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    coverage: {
      reporter: ["text", "lcov"],
    },
    include: ["test/**/*.spec.{ts,tsx}", "test/**/__tests__/**/*.{ts,tsx}"],
  },
});
