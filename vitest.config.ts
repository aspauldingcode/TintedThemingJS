/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
            exclude: ['**/*.test.ts', '**/*.test.tsx', '**/index.ts', '**/types.ts'],
        },
        alias: {
            '@tinted-theming/core': resolve(__dirname, './packages/core/src'),
            '@tinted-theming/react': resolve(__dirname, './packages/react/src'),
        },
    },
})
