// main.js o main.ts
import { createApp } from 'vue'
import App from './App.vue'

// Importa Vuetify y estilos principales
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// Importa los iconos MDI
import '@mdi/font/css/materialdesignicons.css'

// Importa los sets de iconos de Vuetify
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  // ... otros settings de Vuetify si tienes
})

const app = createApp(App)
app.use(vuetify)
app.mount('#app')