// eslint.config.mjs

import js from '@eslint/js'; // Import ESLint's recommended configurations
import globals from 'globals'; // Import browser and node global variables

export default [
  js.configs.recommended, // Use recommended settings
  {
    languageOptions: {
      ecmaVersion: 2021, // Specify ECMAScript version
      sourceType: 'module', // Enable ES modules
      globals: {
        ...globals.browser, // Include browser globals (like window, document)
        ...globals.node, // Include Node.js globals
      },
    },
    rules: {
      // Define your custom rules
      'no-unused-vars': 'warn', // Warn about unused variables
      'no-console': 'off', // Allow console statements (remove this for production)
      'semi': ['error', 'always'], // Enforce semicolons
      'quotes': ['error', 'single'], // Enforce single quotes
      'no-debugger': 'warn', // Warn about debugger statements
      'no-var': 'error', // Disallow var declarations (use let or const)
      'prefer-const': 'warn', // Suggest using const where possible
    },
  },
];
