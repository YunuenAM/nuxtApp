<script setup>
const estados = ref([])
const estadosUnicos = ref([])
const aniosUnicos = ref([])
const selectedEstado = ref(null)
const selectedAnio = ref(null)
const estadoBuscado = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const maxVisiblePages = ref(3)
const sortOrder = ref(null)
const mobileActionsEstado = ref(null)

// Dialogo para agregar año
const dialogAgregarAnio = ref(false);
const nuevoAnio = ref('');
const errorAnio = ref('');

const generarDatos = () => {
  const nombres = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán',
    'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
    'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco',
    'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
  ]
  const anios = [2019, 2020, 2021, 2022, 2023, 2024, 2025]
  const datos = []
  nombres.forEach(nombre => {
    anios.forEach(anio => {
      datos.push({
        nombre,
        anio,
        idh: +(Math.random() * (1 - 0.5) + 0.5).toFixed(3),
      })
    })
  })
  estados.value = datos
  estadosUnicos.value = nombres
  aniosUnicos.value = anios
}

const limpiarCampos = () => {
  currentPage.value = 1
  estadoBuscado.value = ''
  selectedEstado.value = null
  selectedAnio.value = null
  sortOrder.value = null
}

// FILTROS Y ORDEN
const filteredEstados = computed(() => {
  let filtered = [...estados.value]
  const busqueda = estadoBuscado.value.trim().toLowerCase()
  if (busqueda) {
    filtered = filtered.filter(e =>
      e.nombre.toLowerCase().includes(busqueda)
    )
  } else if (selectedEstado.value) {
    filtered = filtered.filter(e =>
      e.nombre === selectedEstado.value
    )
  }
  if (selectedAnio.value) {
    filtered = filtered.filter(e =>
      e.anio === selectedAnio.value
    )
  }
  return filtered
})

const sortedEstados = computed(() => {
  if (!sortOrder.value) return filteredEstados.value
  const sorted = [...filteredEstados.value]
  sorted.sort((a, b) =>
    sortOrder.value === 'asc' ? a.idh - b.idh : b.idh - a.idh
  )
  return sorted
})

const paginatedEstados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return sortedEstados.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() =>
  Math.ceil(sortedEstados.value.length / itemsPerPage.value)
)

const visiblePages = computed(() => {
  const total = totalPages.value
  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages.value / 2))
  const end = Math.min(total, start + maxVisiblePages.value - 1)
  if (end - start < maxVisiblePages.value - 1) {
    start = Math.max(1, end - maxVisiblePages.value + 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const abrirDialogoAgregarAnio = () => {
  dialogAgregarAnio.value = true;
  nuevoAnio.value = '';
  errorAnio.value = '';
};

const agregarAnio = () => {
  const valor = parseInt(nuevoAnio.value);
  if (!valor || valor < 1900 || valor > 2100) {
    errorAnio.value = 'Introduce un año válido entre 1900 y 2100';
    return;
  }
  if (aniosUnicos.value.includes(valor)) {
    errorAnio.value = 'El año ya existe';
    return;
  }
  aniosUnicos.value.push(valor);
  aniosUnicos.value.sort((a, b) => a - b);
  estadosUnicos.value.forEach(nombre => {
    estados.value.push({
      nombre,
      anio: valor,
      idh: +(Math.random() * (1 - 0.5) + 0.5).toFixed(3),
    });
  });
  dialogAgregarAnio.value = false;
};

const goToPage = page => (currentPage.value = page)
const previousPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

onMounted(() => {
  generarDatos()
  limpiarCampos()
})

watch(estadoBuscado, val => {
  if (val.trim()) {
    selectedEstado.value = null
    currentPage.value = 1
  }
})

watch(selectedEstado, () => {
  currentPage.value = 1
})

watch(selectedAnio, () => {
  currentPage.value = 1
})

// ACCIONES DE TABLA
const verGrafico = estado => {
  alert(`Ver gráfico de: ${estado.nombre} ${estado.anio}`)
}
const editarEstado = estado => {
  alert(`Editar: ${estado.nombre} ${estado.anio}`)
}
const eliminarEstado = estado => {
  if (confirm(`¿Eliminar el registro de ${estado.nombre} (${estado.anio})?`)) {
    estados.value = estados.value.filter(
      e => !(e.nombre === estado.nombre && e.anio === estado.anio && e.idh === estado.idh)
    )
  }
}

// Ordenar
function sortData(order) {
  sortOrder.value = order === 'asc' || order === 'desc' ? order : null
}

// Acciones mobile
function openMobileActions(estado) {
  if (mobileActionsEstado.value && mobileActionsEstado.value.nombre === estado.nombre && mobileActionsEstado.value.anio === estado.anio && mobileActionsEstado.value.idh === estado.idh) {
    mobileActionsEstado.value = null
  } else {
    mobileActionsEstado.value = estado
  }
}
function closeMobileActions() {
  mobileActionsEstado.value = null
}
</script>

<template>
  <v-container class="bg-gradient-table" fluid>
    <!-- Top bar -->
    <v-row class="top-bar" align="center">
      <v-col cols="12" md="6">
        <div class="titulo">Resumen de Índice de Desarrollo Humano en México</div>
      </v-col>
      <v-col cols="12" md="6" class="top-bar__actions" style="display: flex; gap: 16px; align-items: center;">
        <v-select
          v-model="selectedEstado"
          :items="[{title:'Todos', value:null}, ...estadosUnicos.map(e=>({title:e, value:e}))]"
          label="Selecciona Estado"
          class="selector"
          variant="outlined"
          density="compact"
          hide-details
        />
        <v-select
          v-model="selectedAnio"
          :items="[{title:'Todos', value:null}, ...aniosUnicos.map(a=>({title:a, value:a}))]"
          label="Selecciona Año"
          class="selector"
          variant="outlined"
          density="compact"
          hide-details
        />
        <v-select
          :model-value="sortOrder"
          :items="[
            {title: 'Normal', value: null},
            {title: 'Ascendente', value: 'asc'},
            {title: 'Descendente', value: 'desc'}
          ]"
          label="Ordenar"
          class="selector"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="sortData"
        />
      </v-col>
    </v-row>

    <v-col cols="12" md="6">
      <div class="filtros-panel">
        <!-- Filtro Estado -->
        <div class="filtro-custom">
          <select v-model="selectedEstado" class="filtro-select">
            <option :value="null">Selecciona Estado</option>
            <option v-for="e in estadosUnicos" :key="e" :value="e">{{ e }}</option>
          </select>
          <span class="filtro-arrow"/>
        </div>
        <!-- Filtro Año -->
        <div class="filtro-custom">
          <select v-model="selectedAnio" class="filtro-select">
            <option :value="null">Selecciona Año</option>
            <option v-for="a in aniosUnicos" :key="a" :value="a">{{ a }}</option>
          </select>
          <span class="filtro-arrow"/>
        </div>
        <!-- Filtro Ordenar -->
        <div class="filtro-custom">
          <select v-model="sortOrder" class="filtro-select">
            <option :value="null">Ordenar</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
          <span class="filtro-arrow"/>
        </div>
      </div>
    </v-col>

    <!-- Tabla -->
    <div class="tabla-panel">
      <div class="tabla-header" style="display: flex; align-items: center; gap: 10px;">
        <input
          v-model="estadoBuscado"
          class="tabla-search"
          placeholder="🔍 Buscar entidad..."
          type="text"
        >
        <button class="btn-anio" @click="abrirDialogoAgregarAnio">➕ Año</button>
      </div>

      <div class="tabla-scroll">
      <v-table class="tabla-lista">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Año</th>
            <th>IDH</th>
            <th class="desktop-col">Ver Gráfica</th>
            <th class="desktop-col">Acciones</th>
            <th class="mobile-col" style="display:none;">Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="estado in paginatedEstados" :key="`${estado.nombre}-${estado.anio}-${estado.idh}`">
            <td>{{ estado.nombre }}</td>
            <td>{{ estado.anio }}</td>
            <td>{{ estado.idh }}</td>
            <!-- Desktop acciones -->
            <td class="desktop-col">
              <v-btn variant="text" class="icon-btn" title="Ver gráfico" @click="verGrafico(estado)">
                <span class="icon-bar-chart"/>
              </v-btn>
            </td>
            <td class="desktop-col">
              <v-btn variant="text" class="icon-btn" title="Editar" @click="editarEstado(estado)">
                <span class="icon-edit"/>
              </v-btn>
              <v-btn variant="text" class="icon-btn" title="Eliminar" @click="eliminarEstado(estado)">
                <span class="icon-delete"/>
              </v-btn>
            </td>
            <!-- Mobile acciones -->
            <td class="mobile-col" style="display:none;position:relative;">
              <button class="hamburger-btn" aria-label="Mostrar acciones" @click="openMobileActions(estado)">
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                  <circle cx="4" cy="11.5" r="2" fill="#fff"/>
                  <circle cx="11.5" cy="11.5" r="2" fill="#fff"/>
                  <circle cx="19" cy="11.5" r="2" fill="#fff"/>
                </svg>
              </button>
              <div
                v-if="mobileActionsEstado && mobileActionsEstado.nombre === estado.nombre && mobileActionsEstado.anio === estado.anio && mobileActionsEstado.idh === estado.idh"
                class="mobile-actions-menu"
                @click.stop
              >
                <button @click="verGrafico(estado); closeMobileActions()">Ver Gráfica</button>
                <button @click="editarEstado(estado); closeMobileActions()">Editar</button>
                <button @click="eliminarEstado(estado); closeMobileActions()">Eliminar</button>
                <button class="close-btn" @click="closeMobileActions">Cerrar</button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedEstados.length === 0">
            <td colspan="6" class="sin-resultados">No hay resultados.</td>
          </tr>
        </tbody>
      </v-table>
      </div>
      <!-- Paginación -->
      <div class="paginador">
        <button class="paginador-btn" :disabled="currentPage === 1" @click="previousPage">&lt;</button>
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="['paginador-btn', { active: page === currentPage }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button class="paginador-btn" :disabled="currentPage === totalPages" @click="nextPage">&gt;</button>
      </div>
    </div>

    <!-- Modal centrado para agregar año -->
    <div v-if="dialogAgregarAnio" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <h3>Agregar nuevo año</h3>
        <input v-model="nuevoAnio" type="number" placeholder="Año" min="1900" max="2100" @keyup.enter="agregarAnio">
        <div v-if="errorAnio" class="dialog-error">{{ errorAnio }}</div>
        <div class="dialog-actions">
          <button @click="agregarAnio">Agregar</button>
          <button @click="dialogAgregarAnio = false">Cancelar</button>
        </div>
      </div>
    </div>
    <!-- Overlay para cerrar el menú móvil tocando fuera -->
    <div
      v-if="mobileActionsEstado"
      class="mobile-action-overlay"
      style="position: fixed;top:0;left:0;right:0;bottom:0;z-index:1039;"
      @click="closeMobileActions"
    />
  </v-container>
</template>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
.bg-gradient-table {
  min-height: 100vh;
  padding: 0;
  font-family: 'Roboto', Arial, sans-serif;
}
.top-bar {
  margin-top: 32px;
  margin-bottom: 18px;
}
.titulo {
  color: #FFF;
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: 6px;
  display: block;
}
.top-bar__actions {
  gap: 16px;
}
.selector {
  min-width: 210px;
}
.tabla-panel {
 background: linear-gradient(180deg, #131b2e 0%, #2150a4 100%);
  border-radius: 17px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 34px 24px 24px 24px;
  box-shadow: 0 0 24px #1a274466;
}
.tabla-header {
  margin-bottom: 14px;
  align-items: center;
  gap: 10px;
}
.tabla-search {
  border-radius: 10px;
  padding: 9px 18px;
  border: none;
  outline: none;
  font-size: 1.06em;
  background: #232e4b;
  color: #e7efff;
  min-width: 130px;
  margin-right: 10px;
}
.btn-anio {
  background: #ff5e2a;
  color: #fff;
  border-radius: 14px;
  padding: 8px 19px;
  font-size: 1em;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background 0.18s;
}
.btn-anio:hover {
  background: #e13c00;
}
.tabla-lista th {
  background: none;
  color: #fff;
  font-weight: 700;
  font-size: 1.14em;
  text-align: left;
  padding: 14px 10px;
  letter-spacing: 1px;
  border-bottom: 1px solid #2855a1;
}
.tabla-lista td {
  color: #fff;
  min-width: 10%;
  min-height: auto;
  font-size: 1.08em;
  padding: 13px 10px;
  border-bottom: 1px solid #182849;
  background: transparent;
}
.tabla-lista tr:last-child td {
  border-bottom: none;
}
.tabla-lista tbody tr:hover {
  background: #203673 !important;
  transition: background 0.18s;
}
.icon-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  margin: 0 3px;
  font-size: 1.2em;
  vertical-align: middle;
  min-width: 24px;
}
.icon-bar-chart::before {
  content: "\1F5A5";
  font-size: 1.19em;
}
.icon-edit::before {
  content: "\270E";
  font-size: 1.13em;
}
.icon-delete::before {
  content: "\1F5D1";
  font-size: 1.13em;
}
.paginador {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 13px;
}
.paginador-btn {
  background: #1f345e;
  color: #fff;
  border: none;
  border-radius: 11px;
  min-width: 38px;
  min-height: 38px;
  font-size: 1.13em;
  margin: 0 3px;
  transition: background 0.15s, color 0.15s;
  font-weight: 600;
  cursor: pointer;
}
.paginador-btn.active, .paginador-btn:hover {
  background: #3165e0;
  color: #fff;
}
.paginador-btn:disabled {
  background: #2a3d6d;
  color: #a7b1c9;
  cursor: not-allowed;
}
.sin-resultados {
  text-align: center;
  color: #fff;
  padding: 18px 0;
}

.filtros-panel {
  display: flex;
  gap: 32px;
  justify-content: flex-end;
  margin-bottom: 10px;
  margin-top: 5px;
}
.filtro-custom {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 270px;
  background: linear-gradient(90deg, #151e35 80%, #11214a 100%);
  border-radius: 18px;
  border: 1.2px solid #d8e5ff22;
  box-shadow: 0 1px 12px #1a274422;
  overflow: hidden;
  margin-right: 5px;
}
.filtro-select {
  appearance: none;
  outline: none;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1.09em;
  font-family: inherit;
  padding: 15px 46px 15px 21px;
  width: 100%;
  cursor: pointer;
}
.filtro-select:focus {
  background: #1a274444;
}
.filtro-arrow {
  position: absolute;
  right: 18px;
  top: 0; bottom: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
}
.filtro-arrow::after {
  content: '';
  display: inline-block;
  border: solid #fff;
  border-width: 0 3px 3px 0;
  padding: 8px;
  margin-left: 2px;
  transform: rotate(45deg);
  opacity: 0.85;
}


/* MODAL CENTRADO */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(23, 33, 54, 0.65);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #15244a;
  border-radius: 14px;
  padding: 30px 28px 20px 28px;
  box-shadow: 0 0 38px #1a274488;
  min-width: 320px;
  max-width: 92vw;
  text-align: center;
  position: relative;
  animation: modal-pop 0.2s;
}
@keyframes modal-pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.modal-content h3 {
  color: #fff;
  margin-bottom: 16px;
}
.modal-content input[type="number"] {
  border-radius: 10px;
  padding: 10px 14px;
  border: none;
  outline: none;
  font-size: 1.08em;
  background: #232e4b;
  color: #e7efff;
  width: 100%;
  margin-bottom: 10px;
}
.dialog-error {
  color: #ff5e2a;
  margin-bottom: 9px;
  font-size: 0.98em;
}
.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.dialog-actions button {
  background: #3165e0;
  color: #fff;
  border: none;
  border-radius: 11px;
  padding: 7px 20px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s;
}
.dialog-actions button:hover {
  background: #1f345e;
}

@media (max-width: 650px) {
  .hide-on-mobile {
    display: none !important;
  }
  .show-on-mobile {
    display: inline-block !important;
    margin-left: 6px;
  }
  .tabla-header {
    flex-direction: row;
    gap: 5px;
  }
  .btn-anio {
    padding: 6px 11px;
    font-size: 0.94em;
    min-width: 80px;
  }
  .tabla-panel {
    padding: 7px 0 7px 0;
  }
}
@media (max-width: 650px) {
  .desktop-col {
    display: none !important;
  }
  .mobile-col {
    display: table-cell !important;
  }
}
@media (min-width: 651px) {
  .mobile-col {
    display: none !important;
  }
}

/* Estilo del menú hamburguesa */
.hamburger-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  min-width: 38px;
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border-radius: 50%;
  transition: background 0.13s;
}
.hamburger-btn:active,
.hamburger-btn:focus {
  background: #2a3d6d;
  outline: none;
}
.mobile-actions-menu {
  position: absolute;
  right: 0;
  top: 36px;
  background: #1a2a44;
  border-radius: 11px;
  box-shadow: 0 2px 28px #111a2b55;
  min-width: 140px;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.17s;
  border: 1px solid #2950bc;
  overflow: hidden;
}
.mobile-actions-menu button {
  background: none;
  color: #fff;
  border: none;
  font-size: 1em;
  padding: 13px 16px;
  text-align: left;
  transition: background 0.15s;
  cursor: pointer;
  border-bottom: 1px solid #17325e44;
}
.mobile-actions-menu button:last-child {
  border-bottom: none;
}
.mobile-actions-menu button:hover {
  background: #203673;
}
.mobile-actions-menu .close-btn {
  color: #ff7e47;
  font-weight: 700;
  background: #1a2a44;
}
.mobile-action-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: transparent;
  z-index: 1040;
}
.menu-filtros-lista {
  min-width: 180px;
  background: #1a2a44;
  color: #fff;
}
.menu-filtros-lista .v-select__content {
  color: #fff;
}
.menu-filtros-lista .selector {
  width: 100%;
  margin-bottom: 8px;
}
.tabla-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.tabla-lista {
  min-width: 600px;
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
}
.tabla-lista th,
.tabla-lista td {
  white-space: unset;
}

/* Extra: Media queries para TABLET y MOBILE */

@media (max-width: 1024px) {
  .tabla-panel {
    max-width: 98vw;
    padding: 16px 8px;
  }
  .titulo {
    font-size: 1.13rem;
  }
  .filtros-panel {
    gap: 20px;
    flex-wrap: wrap;
  }
  .selector, .filtro-custom {
    min-width: 148px;
    font-size: 0.98em;
  }
  .tabla-lista {
    min-width: 420px;
    font-size: 0.98em;
  }
  .tabla-header {
    flex-direction: row;
    gap: 8px;
  }
}

@media (max-width: 800px) {
  .tabla-panel {
    padding: 7px 2px 7px 2px;
  }
  .filtros-panel {
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
  }
  .top-bar__actions {
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
  }
  .selector, .filtro-custom {
    min-width: 120px;
    font-size: 0.93em;
  }
  .tabla-lista th, .tabla-lista td {
    padding: 9px 5px;
  }
  .btn-anio {
    padding: 6px 9px;
    font-size: 0.93em;
    min-width: 70px;
  }
}

@media (max-width: 650px) {
  .tabla-panel {
    padding: 4px 0 4px 0;
    max-width: 100vw;
  }
  .tabla-lista {
    min-width: 300px;
    font-size: 0.90em;
  }
  .titulo {
    font-size: 0.97rem;
  }
  .filtros-panel, .top-bar__actions {
    flex-direction: column !important;
    gap: 7px;
    width: 100%;
    margin-bottom: 12px;
    align-items: stretch;
  }
  .selector {
    min-width: 0;
    width: 100%;
    margin-right: 0 !important;
  }
}

@media (max-width: 480px) {
  .tabla-panel {
    padding: 0 0 0 0;
  }
  .tabla-lista {
    min-width: 180px;
    font-size: 0.82em;
  }
  .titulo {
    font-size: 0.78em;
  }
  .btn-anio {
    padding: 4px 5px;
    font-size: 0.78em;
    min-width: 60px;
  }
  .modal-content {
    min-width: 90vw;
    padding: 16px 4px 8px 4px;
  }
}

/* Responsive: filtros uno debajo del otro en mobile */
@media (max-width: 650px) {
  .filtros-flex {
    flex-direction: column !important;
    gap: 7px;
    width: 100%;
    margin-bottom: 12px;
  }
  .selector {
    min-width: 0;
    width: 100%;
    margin-right: 0 !important;
  }
  .top-bar__actions {
    gap: 0;
  }
}

/* ...resto de tu CSS igual... */

.tabla-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.tabla-lista {
  min-width: 600px;
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
}
.tabla-lista th,
.tabla-lista td {
  white-space: unset;
}
@media (max-width: 600px) {
  .tabla-lista th.desktop-col,
  .tabla-lista td.desktop-col {
    display: none;
  }
  .tabla-lista {
    min-width: 320px;
    font-size: 0.92em;
  }
}

</style>