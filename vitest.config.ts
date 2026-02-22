import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.spec.ts', 'lib/**/*.test.ts', 'composables/**/*.spec.ts'],
    globals: true,
  },
})
