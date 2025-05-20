<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="!isMobile"
    :temporary="isMobile"
    app
    width="260"
    class="pa-4 d-flex flex-column justify-space-between gradient-dark"
  >
    <div class="text-center">
      <v-img
        :src="logo"
        alt="HDI Logo"
        max-width="80"
        class="mx-auto mb-2"
        aspect-ratio="1"
        contain
      />
      <div class="text-white text-h6 font-weight-bold">HDI</div>
    </div>

    <v-list dense nav class="mt-10">
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :active="activeItem === item.title"
        class="custom-menu-item"
        rounded
        @click="handleNavigation(item)"
      >
        <template #prepend>
          <v-img
            :src="item.icon"
            alt="icon"
            max-width="22"
            class="me-3"
            contain
          />
        </template>
        <v-list-item-title class="text-white">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-card class="help-card mt-auto text-center pa-4" elevation="8" rounded>
      <v-img
        :src="helpIcon"
        alt="Ayuda"
        max-width="28"
        class="mx-auto mb-2"
        contain
      />
      <div class="text-white text-subtitle-2 mb-2">¿Necesitas ayuda?</div>
      <v-btn
        block
        color="primary"
        variant="flat"
        class="text-white font-weight-bold"
        @click="contactSupport"
      >
        Contáctanos
      </v-btn>
    </v-card>
  </v-navigation-drawer>

  <!-- Botón hamburguesa solo en móviles -->
  <v-app-bar flat app class="d-md-none">
    <v-app-bar-nav-icon @click="drawer = !drawer" />
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Imágenes
import logo from '@/assets/logo.png';
import dashboardIcon from '@/assets/dashboard.svg';
import barChartIcon from '@/assets/bar-chart.svg';
import billingIcon from '@/assets/billing.svg';
import gearIcon from '@/assets/gear.svg';
import helpIcon from '@/assets/question-circle.png';

const router = useRouter();
const activeItem = ref('Tablero');
const drawer = ref(true);

const menuItems = [
  { title: 'Tablero', icon: dashboardIcon, route: '/dashboard' },
  { title: 'Gráficos', icon: barChartIcon, route: '/charts' },
  { title: 'Facturación', icon: billingIcon, route: '/billing' },
  { title: 'Configuración', icon: gearIcon, route: '/settings' },
];

// Responsive detection
const isMobile = computed(() => window.innerWidth < 768);
const handleNavigation = (item) => {
  activeItem.value = item.title;
  router.push(item.route);
  if (isMobile.value) drawer.value = false;
};

// Recalcular tamaño al redimensionar
onMounted(() => {
  window.addEventListener('resize', () => {
    if (isMobile.value) drawer.value = false;
    else drawer.value = true;
  });
});

const contactSupport = () => {
  alert('Funcionalidad de contacto con soporte.');
};
</script>

<style scoped>
.gradient-dark {
  background: linear-gradient(to bottom, #0d0f2b, #1a1c3f);
}

.custom-menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.12) !important;
  border-left: 4px solid #42a5f5;
  padding-left: 12px !important;
}

.help-card {
  background: linear-gradient(135deg, #2a2e5d, #1c1c3f);
}
</style>
