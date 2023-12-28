import {defineConfig} from "vite"
import path from 'path'

export default defineConfig({
    base: '/virus-slayer/',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src')
        }
    }
})
