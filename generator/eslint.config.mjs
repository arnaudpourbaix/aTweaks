import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules', 'dist', 'coverage'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
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
    },
  },
  eslintConfigPrettier,
);
