import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

// Apply the recommended JavaScript and TypeScript rules to the entire test project.
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Generated Playwright artifacts and installed dependencies are not source code.
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'],
  },
);
