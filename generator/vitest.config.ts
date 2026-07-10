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
    silent: "passed-only",
    coverage: {
      provider: "istanbul",
      reporter: ["text-summary", "html"],
      include: ["lib/**/*.ts"],
      exclude: [
        "lib/**/*.test.ts",
        "lib/config/**",
        "lib/creatures/**",
      ],
    },
  },
});
