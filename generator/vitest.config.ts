import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    target: "es2022",
  },
  esbuild: {
    target: "es2022",
    tsconfigRaw: {
      compilerOptions: {
        target: "es2022",
      },
    },
  },
  test: {
    include: ["lib/**/*.test.ts"],
    // "passed-only" is a vitest 3.x value; the installed vitest 2.1.9 only accepts a boolean
    // (and would otherwise silently treat the truthy string as `true`, hiding failures too).
    silent: false,
    coverage: {
      provider: "istanbul",
      reporter: ["text-summary", "html"],
      include: ["lib/**/*.ts"],
      exclude: ["lib/**/*.test.ts", "lib/config/**", "lib/creatures/**"],
    },
  },
});
