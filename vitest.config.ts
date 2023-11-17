import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        reporters: ['default', 'json'],
        outputFile: './test-pyramid-report.json',
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    },
})