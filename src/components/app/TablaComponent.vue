<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const estados = ref([]);
const estadosUnicos = ref([]);
const aniosUnicos = ref([]);
const selectedFilters = ref({ estados: [], anios: [] });
const currentPage = ref(1);
const itemsPerPage = ref(6);
const maxVisiblePages = 3;
const estadoBuscado = ref('');

const generarDatos = () => {
  const nombres = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán',
    'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
    'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco',
    'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
  ];
  const anios = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const datos = [];

  nombres.forEach((estado) => {
    anios.forEach((anio) => {
      datos.push({
        nombre: estado,
        anio,
        idh: (Math.random() * (1 - 0.5) + 0.5).toFixed(3),
      });
    });
  });

  estados.value = datos;
  estadosUnicos.value = nombres;
  aniosUnicos.value = anios;
};

const limpiarCampos = () => {
  selectedFilters.value = { estados: [], anios: [] };
  currentPage.value = 1;
  estadoBuscado.value = '';
};

const filteredEstados = computed(() => {
  let filtered = [...estados.value];
  const busqueda = estadoBuscado.value.trim().toLowerCase();

  if (busqueda) {
    filtered = filtered.filter((e) =>
      e.nombre.toLowerCase().includes(busqueda)
    );
  } else if (selectedFilters.value.estados.length) {
    filtered = filtered.filter((e) =>
      selectedFilters.value.estados.includes(e.nombre)
    );
  }

  if (selectedFilters.value.anios.length) {
    filtered = filtered.filter((e) =>
      selectedFilters.value.anios.includes(e.anio)
    );
  }

  return filtered;
});

const sortData = (order) => {
  estados.value.sort((a, b) =>
    order === 'asc' ? a.idh - b.idh : b.idh - a.idh
  );
  currentPage.value = 1;
};

const paginatedEstados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredEstados.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() =>
  Math.ceil(filteredEstados.value.length / itemsPerPage.value)
);

const visiblePages = computed(() => {
  const start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  const end = Math.min(totalPages.value, start + maxVisiblePages - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const goToPage = (page) => (currentPage.value = page);
const previousPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;

onMounted(() => {
  generarDatos();
  limpiarCampos();
});

watch(estadoBuscado, (val) => {
  if (val.trim()) {
    selectedFilters.value.estados = [];
    currentPage.value = 1;
  }
});
</script>

<template>
  <div class="bg-gradient-to-b from-gradientStart to-gradientEnd min-h-screen py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-darkerblue shadow rounded-lg p-6">
        <h2 class="text-white text-2xl font-bold mb-6 text-center">
          Resumen de Índice de Desarrollo Humano en México
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <input
            v-model="estadoBuscado"
            type="text"
            placeholder="Buscar por estado"
            class="p-2 rounded bg-darkblue text-white border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >

          <select
            v-model="selectedFilters.estados"
            multiple
            class="p-2 rounded bg-darkblue text-white border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option v-for="estado in estadosUnicos" :key="estado" :value="estado">
              {{ estado }}
            </option>
          </select>

          <select
            v-model="selectedFilters.anios"
            multiple
            class="p-2 rounded bg-darkblue text-white border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option v-for="anio in aniosUnicos" :key="anio" :value="anio">
              {{ anio }}
            </option>
          </select>

          <select
            class="p-2 rounded bg-darkblue text-white border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            @change="sortData($event.target.value)"
          >
            <option value="" disabled selected>Ordenar por IDH</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        <button
          class="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition mb-6"
          @click="limpiarCampos"
        >
          Limpiar Campos
        </button>

        <table class="table-auto w-full text-white">
          <thead class="bg-primary">
            <tr>
              <th class="px-4 py-2">Estado</th>
              <th class="px-4 py-2">Año</th>
              <th class="px-4 py-2">IDH</th>
              <th class="px-4 py-2">Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(estado, index) in paginatedEstados"
              :key="index"
              class="bg-darkblue even:bg-darkerblue"
            >
              <td class="px-4 py-2">{{ estado.nombre }}</td>
              <td class="px-4 py-2">{{ estado.anio }}</td>
              <td class="px-4 py-2">{{ estado.idh }}</td>
              <td class="px-4 py-2 flex justify-center space-x-2">
                <button class="text-primary hover:text-white transition">
                  📊
                </button>
                <button class="text-primary hover:text-white transition">
                  ✏️
                </button>
                <button class="text-primary hover:text-white transition">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 flex justify-center space-x-2">
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
            @click="previousPage"
          >
            ←
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="{
              'bg-primary text-white': page === currentPage,
              'bg-darkblue text-primary': page !== currentPage,
            }"
            class="px-3 py-1 rounded hover:bg-primary hover:text-white transition"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
            @click="nextPage"
          >
            →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>