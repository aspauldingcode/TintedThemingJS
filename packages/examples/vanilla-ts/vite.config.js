import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    base: '/vanilla-ts/',
    server: {
        port: 5175,
        strictPort: true,
    },
    resolve: {
        alias: {
            '@tinted-theming/core': path.resolve(__dirname, '../../core/src/index.ts')
        }
    }
})
