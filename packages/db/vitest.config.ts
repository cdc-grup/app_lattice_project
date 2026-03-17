import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 60000, // DB operations can be slow in some CI environments
    include: ['__tests__/**/*.test.ts'],
  },
});
