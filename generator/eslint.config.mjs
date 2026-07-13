import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import sonarjs from 'eslint-plugin-sonarjs';

export default tseslint.config(
  {
    // eslint.config.mjs itself: type-aware parsing needs it in tsconfig.eslint.json's `include`,
    // but tsc's project service doesn't recognize .mjs without `allowJs`, which this project
    // doesn't otherwise need - simplest to just exclude the one file from type-aware linting.
    ignores: ['node_modules', 'dist', 'coverage', 'eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Same as strictTypeChecked's own config for this rule, except allowNumber/allowBoolean
      // flipped to true (this codebase constantly stringifies typed opcode params/enums into
      // generated WeiDU output). Every flag must be listed explicitly: flat config replaces a
      // rule's whole options object rather than merging, so omitting one here would silently
      // reset it to the rule's own (much more permissive) built-in defaults.
      '@typescript-eslint/restrict-template-expressions': [
        'error',
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
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // `.mockImplementation(() => {})`/`vi.fn(() => {})`-style no-op stubs are the standard way
      // to silence a spied method (console.log, etc.) in a test - not a sign of missing logic.
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      // allowAsThisParameter: `this: void` on a method that's deliberately called detached from
      // its instance (see trigger.factory.ts's inverseNegation(), fixed for unbound-method) is
      // exactly what this syntax is for.
      '@typescript-eslint/no-invalid-void-type': ['error', { allowAsThisParameter: true }],
      // Outstanding TODOs/FIXMEs are tracked in TODO_ROADMAP.md instead of as blocking lint
      // errors - most need game/mod domain knowledge to triage, not a mechanical fix.
      'sonarjs/todo-tag': 'off',
      'sonarjs/fixme-tag': 'off',
    },
  },
  eslintConfigPrettier,
);
