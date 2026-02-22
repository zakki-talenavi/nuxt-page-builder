import js from '@eslint/js'
import tsparser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: {
        ...globals.browser,
        ...globals.node,
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        ref: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        onBeforeUnmount: 'readonly',
        provide: 'readonly',
        inject: 'readonly',
        useRoute: 'readonly',
        useHead: 'readonly',
        onErrorCaptured: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
  { ignores: ['node_modules', '.nuxt', 'dist', 'output', 'coverage', '**/*.spec.ts', '**/*.test.ts', 'test_dnd.mjs'] },
]
