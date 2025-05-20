<template>
  <v-app>
    <div
      id="app"
      class="app-container"
    >
     <NavbarComponent />
      <TablaComponent />
  </div></v-app>
</template>

<script setup>
import NavbarComponent from './src/components/app/NavbarComponent.vue';
import TablaComponent from './src/components/app/TablaComponent.vue';


</script>

<style scoped>
/* Asegura que el fondo azul cubra toda la pantalla */
:global(html),
:global(body),
:global(#app) {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Contenedor principal */
.app-container {
  display: flex;
  flex-direction: column; /* Por defecto, en móvil */
  min-height: 100vh;
  gap: 2rem;
  background-color: #112; /* Azul oscuro */
  color: white;
}

/* En pantallas más grandes, cambia a diseño horizontal */
@media (min-width: 768px) {
  .app-container {
    flex-direction: row;
  }
}
</style>