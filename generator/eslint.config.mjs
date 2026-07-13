import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";

export default tseslint.config(
  {
    // eslint.config.mjs itself: type-aware parsing needs it in tsconfig.eslint.json's `include`,
    // but tsc's project service doesn't recognize .mjs without `allowJs`, which this project
    // doesn't otherwise need - simplest to just exclude the one file from type-aware linting.
    ignores: ["node_modules", "dist", "coverage", "eslint.config.mjs"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  {
    languageOptions: {
      // sonarjs/no-reference-error does its own scope analysis independent of tsc's types -
      // without this it false-positives on every real Node global (console, process, ...).
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Same as strictTypeChecked's own config for this rule, except allowNumber/allowBoolean
      // flipped to true (this codebase constantly stringifies typed opcode params/enums into
      // generated WeiDU output). Every flag must be listed explicitly: flat config replaces a
      // rule's whole options object rather than merging, so omitting one here would silently
      // reset it to the rule's own (much more permissive) built-in defaults.
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowAny: false,
          allowBoolean: true,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
      // Underscore-prefixed convention for intentionally-unused params/vars/catch bindings - most
      // common case is a shared handler signature (e.g. statement-builder.service.ts's dispatch
      // methods) where not every implementation uses every parameter.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // `.mockImplementation(() => {})`/`vi.fn(() => {})`-style no-op stubs are the standard way
      // to silence a spied method (console.log, etc.) in a test - not a sign of missing logic.
      "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
      // allowAsThisParameter: `this: void` on a method that's deliberately called detached from
      // its instance (see trigger.factory.ts's inverseNegation(), fixed for unbound-method) is
      // exactly what this syntax is for.
      "@typescript-eslint/no-invalid-void-type": ["error", { allowAsThisParameter: true }],
      // Outstanding TODOs/FIXMEs are tracked in TODO_ROADMAP.md instead of as blocking lint
      // errors - most need game/mod domain knowledge to triage, not a mechanical fix.
      "sonarjs/todo-tag": "off",
      "sonarjs/fixme-tag": "off",
      // Survey pass (see SONARJS_ROADMAP.md Tier 5): temporarily turning on every rule that
      // `sonarjs/recommended` ships disabled, to see what a stricter preset actually surfaces
      // in this codebase before deciding which of these are worth keeping.
      // requireParameterParentheses matches this project's Prettier default (parens always on
      // single-param arrows) instead of fighting it; requireBodyBraces left at its default
      // (false) to also catch simplifiable `() => { return x; }` bodies.
      "sonarjs/arrow-function-convention": ["error", { requireParameterParentheses: true }],
      "sonarjs/max-union-size": "error",
      "sonarjs/no-reference-error": "error",
      "sonarjs/function-name": "error",
      "sonarjs/no-tab": "error",
      "sonarjs/variable-name": "error",
      "sonarjs/comment-regex": "error",
      "sonarjs/nested-control-flow": "error",
      "sonarjs/too-many-break-or-continue-in-loop": "error",
      "sonarjs/no-nested-incdec": "error",
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/expression-complexity": "error",
      "sonarjs/no-redundant-parentheses": "error",
      "sonarjs/useless-string-operation": "error",
      "sonarjs/no-unused-function-argument": "error",
      "sonarjs/no-duplicate-string": "error",
      "sonarjs/no-sonar-comments": "error",
      "sonarjs/prefer-immediate-return": "error",
      "sonarjs/no-variable-usage-before-declaration": "error",
      "sonarjs/array-constructor": "error",
      "sonarjs/no-function-declaration-in-block": "error",
      "sonarjs/for-in": "error",
      "sonarjs/no-nested-switch": "error",
      "sonarjs/no-built-in-override": "error",
      "sonarjs/prefer-object-literal": "error",
      "sonarjs/web-sql-database": "error",
      "sonarjs/strings-comparison": "error",
      "sonarjs/file-name-differ-from-class": "error",
      "sonarjs/no-incorrect-string-concat": "error",
      "sonarjs/shorthand-property-grouping": "error",
      "sonarjs/arguments-usage": "error",
      "sonarjs/destructuring-assignment-syntax": "error",
      "sonarjs/class-prototype": "error",
      "sonarjs/no-require-or-define": "error",
      "sonarjs/operation-returning-nan": "error",
      "sonarjs/values-not-convertible-to-numbers": "error",
      "sonarjs/non-number-in-arithmetic-expression": "error",
      "sonarjs/declarations-in-global-scope": "error",
      "sonarjs/no-inconsistent-returns": "error",
      "sonarjs/conditional-indentation": "error",
      "sonarjs/no-for-in-iterable": "error",
      "sonarjs/no-return-type-any": "error",
      "sonarjs/no-implicit-dependencies": "error",
      "sonarjs/os-command": "error",
      "sonarjs/bool-param-default": "error",
      "sonarjs/no-unsafe-unzip": "error",
      "sonarjs/no-intrusive-permissions": "error",
      "sonarjs/hidden-files": "error",
      "sonarjs/no-mixed-content": "error",
      "sonarjs/frame-ancestors": "error",
      "sonarjs/confidential-information-logging": "error",
      "sonarjs/no-ip-forward": "error",
      "sonarjs/unicode-aware-regex": "error",
      "sonarjs/aws-iam-all-resources-accessible": "error",
      // Decided off after review (see SONARJS_ROADMAP.md Tier 5): each either fights an
      // established project convention, misfires in this environment, or duplicates ground
      // already covered by another rule/roadmap.
      "sonarjs/no-undefined-assignment": "off", // fights the TS-undefined/optional-property idiom used throughout the model
      "sonarjs/file-header": "off", // not a convention this project uses
      "sonarjs/elseif-without-else": "off", // would force empty else {} blocks on dispatch-style if/else-if chains
      "sonarjs/no-wildcard-import": "off", // conflicts with idiomatic `import * as fs from "fs"`
      "sonarjs/cyclomatic-complexity": "off", // redundant with cognitive-complexity, which deliberately doesn't penalize flat dispatch switches the same way
      "sonarjs/no-commented-code": "off", // would relitigate TODO_ROADMAP.md's already-tracked commented-out blocks
      "sonarjs/max-lines": "off", // large creature-family files are large because the domain is large
      "sonarjs/max-lines-per-function": "off", // same reasoning as max-lines
    },
  },
  eslintConfigPrettier,
);
