import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false, // ⬅️ Necesario para generar HTML estático compatible con Firebase
  // nitro: {
  //   preset: 'firebase' // ⬅️ Esto genera la carpeta .output/public para Firebase
  // },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css'
  ],
  alias: {
    '@': resolve(__dirname, './src'),
    '~': resolve(__dirname, './')
  },
  vite: {
    ssr: {
      noExternal: ['vuetify']
    }
  },
  build: {
    transpile: ['vuetify']
  }
})
