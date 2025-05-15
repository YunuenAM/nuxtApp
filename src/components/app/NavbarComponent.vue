<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :permanent="isDesktop"
      :temporary="!isDesktop"
      width="280"
      class="bg-gradient-to-b from-gradientStart to-gradientEnd"
    >
      <!-- Logo -->
      <v-container class="text-center mb-8">
        <v-avatar size="80" class="mx-auto mb-4">
          <v-img
            src="~/assets/hdi-logo.svg"
            alt="HDI Logo"
          />
        </v-avatar>
        <h2 class="text-xl font-bold text-primary">HDI</h2>
      </v-container>

      <!-- Menú -->
      <v-list dense nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :active="activeItem === item.title"
          class="rounded-lg"
          active-class="bg-primary bg-opacity-20"
          @click="handleNavigation(item)"
        >
          <template #prepend>
            <v-avatar size="32" class="bg-transparent mr-4">
              <v-img :src="item.icon" alt="icon" />
            </v-avatar>
          </template>
          <v-list-item-title class="text-white">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Panel de ayuda -->
      <div class="mt-auto p-4 text-center">
        <div
          class="rounded-lg bg-gradient-to-b from-blue-700 to-blue-900 p-6 shadow-lg"
          style="background-image: url('~/assets/help-background.svg'); background-size: cover;"
        >
          <v-avatar size="40" class="mx-auto mb-4">
            <v-img src="~/assets/icons/question-circle.svg" alt="Ayuda" />
          </v-avatar>
          <h3 class="text-sm font-medium text-white mb-2">
            ¿Necesitas ayuda?
          </h3>
          <v-btn
            color="primary"
            text
            class="bg-white bg-opacity-20 text-white hover:bg-opacity-40"
            @click="contactSupport"
          >
            Contáctanos
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Contenido principal -->
    <v-main class="pa-4">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(true);
const activeItem = ref('Tablero');
const isDesktop = ref(true);

const router = useRouter();

const menuItems = [
  { title: 'Tablero', icon: '~/assets/icons/home.svg', route: '/' },
  { title: 'Tablas', icon: '~/assets/icons/bar-chart.svg', route: '/tablas' },
  { title: 'Cuenta', icon: '~/assets/icons/user.svg', route: '/cuenta' },
  { title: 'Ajustes', icon: '~/assets/icons/settings.svg', route: '/ajustes' },
];

const handleNavigation = (item) => {
  activeItem.value = item.title;
  router.push(item.route);
  if (!isDesktop.value) drawer.value = false;
};

const contactSupport = () => {
  console.log('Contacto con soporte');
};
</script>

<style scoped>
.bg-gradient-to-b {
  background: linear-gradient(180deg, #0a254a, #112);
}
.text-primary {
  color: #ff6a00;
}
.bg-primary {
  background-color: #ff6a00;
}
</style>