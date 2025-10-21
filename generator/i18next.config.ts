import { defineConfig } from "i18next-cli";

export default defineConfig({
  locales: ["en", "fr"],
  //  types: { resourcesFile: "locales/**/*.json" },
  extract: {
    input: "lib/src/**/ankheg.ts",
    output: "lib/locales/{{language}}/{{namespace}}.json",
  },
});
