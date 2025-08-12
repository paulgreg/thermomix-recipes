import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import settings from './src/settings.json'

export default defineConfig(() => {
    return {
        build: {
            sourcemap: true,
        },
        base: settings.baseUrl,
        plugins: [react(), svgrPlugin()],
        test: {
            include: ['**/*.test.js'],
            globals: true,
        },
    }
})
