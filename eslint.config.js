const js = require('@eslint/js')
const globals = require('globals')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsparser = require('@typescript-eslint/parser')
const cypress = require('eslint-plugin-cypress/flat')

module.exports = [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'mochawesome-report/**',
      '*.config.js',
      'cypress/reports/**',
      'cypress/screenshots/**',
      'cypress/videos/**'
    ]
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsparser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        context: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      cypress
    },
    rules: {
      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],

      // Code quality
      'prefer-const': 'warn',
      'no-var': 'warn',

      // Cypress specific
      'cypress/no-assigning-return-values': 'warn',
      'cypress/no-unnecessary-waiting': 'warn',
      'cypress/no-async-tests': 'warn',
      'cypress/no-pause': 'warn',

      // Best practices
      'no-throw-literal': 'warn',

      // Disable formatting rules (handled by Prettier)
      semi: 'off',
      quotes: 'off',
      indent: 'off',
      'comma-dangle': 'off'
    }
  },
  {
    files: ['cypress/**/*.{js,ts}'],
    rules: {
      'no-unused-expressions': 'off'
    }
  }
]
