<template>
  <q-page class="crud-productos-page">
    <ShowProduct
      v-if="componenteActual === 'show' && productoSeleccionado"
      :producto="productoSeleccionado"
      @volver="componenteActual = 'list'"
    />

    <!-- Mostrar formulario de registro -->
    <RegisterProduct v-else-if="componenteActual === 'register'" />

    <!-- Vista por defecto: lista de productos con filtros -->
    <template v-else>
      <q-card>
        <q-card-section class="cabecera">
          <div class="titulo">Crud de Productos</div>

          <!-- Botón para registrar nuevo producto -->
          <q-btn
            label="Registrar Producto"
            color="primary"
            icon="add"
            class="q-mb-md q-mt-sm"
            @click="componenteActual = 'register'"
          />

          <!-- Filtros -->
          <div class="filtros">
            <div class="columna">
              <q-select
                v-model="filtroCategoria"
                label="Filtrar por Categoría"
                :options="categorias"
                emit-value
                map-options
                clearable
              />
            </div>
            <div class="columna">
              <q-select
                v-model="filtroEstado"
                label="Filtrar por Disponibilidad"
                :options="estados"
                emit-value
                map-options
                clearable
              />
            </div>
          </div>
        </q-card-section>

        <!-- Tabla de productos -->
        <q-table
          :rows="productosFiltrados"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :loading="loading"
          loading-label="Cargando productos..."
          no-data-label="No hay productos registrados"
        >
          <template #body-cell-acciones="props">
            <q-td align="center">
              <q-btn
                flat
                round
                icon="visibility"
                color="primary"
                size="sm"
                @click="verProducto(props.row)"
              />
              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                size="sm"
                class="btn-accion"
                @click="eliminarProducto(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card>
    </template>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from 'src/stores/product'
import ShowProduct from 'components/producto/ShowProduct.vue'
import RegisterProduct from 'components/admin/producto/RegisterProducto.vue'

interface Producto {
  uid: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
  estado: 'Disponible' | 'Agotado'
}

const productStore = useProductStore()
const loading = ref(true)
const productos = productStore.productos

const columns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' as const, sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' as const },
  { name: 'precio', label: 'Precio', field: 'precio', align: 'right' as const, sortable: true },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'right' as const, sortable: true },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' as const },
  { name: 'estado', label: 'Disponibilidad', field: 'estado', align: 'left' as const },
  { name: 'acciones', label: 'Acciones', field: () => '', align: 'center' as const, sortable: false }
]

const filtroCategoria = ref<string | null>(null)
const filtroEstado = ref<string | null>(null)

const categorias = [
  { label: 'Alimentación', value: 'Alimentación' },
  { label: 'Electrónica', value: 'Electrónica' },
  { label: 'Ropa', value: 'Ropa' },
  { label: 'Hogar', value: 'Hogar' }
]

const estados = [
  { label: 'Disponible', value: 'Disponible' },
  { label: 'Agotado', value: 'Agotado' }
]

const productosFiltrados = computed(() => {
  return productos.filter((producto) => {
    // Modifica el estado del producto dependiendo del stock
    if (producto.stock <= 0) {
      producto.estado = 'Agotado'
    } else {
      producto.estado = 'Disponible'
    }

    const porCategoria = filtroCategoria.value ? producto.categoria === filtroCategoria.value : true
    const porEstado = filtroEstado.value ? producto.estado === filtroEstado.value : true
    return porCategoria && porEstado
  })
})

const componenteActual = ref<'list' | 'show' | 'register'>('list')
const productoSeleccionado = ref<Producto>()

const verProducto = (producto: Producto) => {
  productoSeleccionado.value = producto
  componenteActual.value = 'show'
}

const eliminarProducto = async (producto: Producto) => {
  const confirmado = confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)
  if (confirmado) {
    await productStore.deleteProducto(producto.uid)
  }
}

onMounted(async () => {
  loading.value = true
  await productStore.fetchProductos()
  loading.value = false
})
</script>

<style scoped>
.crud-productos-page {
  padding: 16px;
}

.cabecera {
  padding-bottom: 0;
}

.titulo {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.filtros {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.columna {
  width: 100%;
}

.btn-accion {
  margin-left: 8px;
}

@media (min-width: 600px) {
  .filtros {
    flex-direction: row;
  }

  .columna {
    flex: 1;
  }
}
</style>
