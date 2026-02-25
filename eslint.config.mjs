import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules } from '@eslint/compat';
import globals from 'globals';
import header from '@tony.ganchev/eslint-plugin-header';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  // Airbnb (includes react, import, jsx-a11y, react-hooks rules)
  // fixupConfigRules shims old RuleContext API calls for ESLint 10
  ...fixupConfigRules(compat.extends('airbnb')),

  // Source files
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      header
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, globalThis: 'readonly' }
    },
    rules: {
      'header/header': [2, 'header.txt'],
      'comma-dangle': [2, 'never'],
      'import/no-unresolved': 2,
      'import/no-import-module-exports': 0,
      'implicit-arrow-linebreak': 0,
      'no-param-reassign': [2, { props: false }],
      'jsx-a11y/label-has-for': 0,
      'react/jsx-no-bind': 2,
      'react/jsx-one-expression-per-line': 0,
      'react/no-did-mount-set-state': 0,
      'react/prefer-stateless-function': 2,
      'react/function-component-definition': 0
    }
  },

  // Test files — add Jest globals
  {
    files: ['src/**/*.test.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.jest }
    }
  }
]);
