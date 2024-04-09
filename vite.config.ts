import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const isAnalyze = process.argv.includes('analyze')

  return {
    server: {
      host: '0.0.0.0'
    },
    plugins: [
      vue(),
      isAnalyze
        ? visualizer({
          filename: path.resolve(__dirname, 'node_modules/rollup-plugin-visualizer/stats.html'),
          open: true
        })
        : undefined
    ],
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()]
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
})
