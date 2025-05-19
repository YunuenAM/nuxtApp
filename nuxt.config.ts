import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css' // <-- Importa el CSS de los iconos aquí
  ],
  alias: {
    '@': resolve(__dirname, './src'),
    '~': resolve(__dirname, './')
  },
  vite: {
    ssr: {
      noExternal: ['vuetify'] // NECESARIO para evitar error con .css
    }
  },
  build: {
    transpile: ['vuetify']
  },
plugins: ['./plugins/firebase']
})