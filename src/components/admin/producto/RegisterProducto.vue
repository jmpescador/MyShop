<template>
  <q-card class="q-pa-md register-form">
    <q-card-section>
      <div class="text-h6">Registrar Nuevo Producto</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="registrarProducto">
        <q-input v-model="nombre" label="Nombre" required />
        <q-input v-model="foto" label="URL de la Foto" type="url" />
        <q-input v-model="descripcion" label="Descripción" type="textarea" />
        <q-input v-model.number="precio" label="Precio" type="number" required min="0" />
        <q-input v-model.number="stock" label="Stock" type="number" required min="0" />
        <q-select
          v-model="categoria"
          label="Categoría"
          :options="categorias"
          emit-value
          map-options
          required
        />
        <q-select
          v-model="estado"
          label="Estado"
          :options="estados"
          emit-value
          map-options
          required
        />

        <div class="q-gutter-md q-mt-md">
          <q-btn label="Guardar" type="submit" color="primary" />
          <q-btn label="Cancelar" flat color="secondary" @click="$emit('volver')" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from 'src/stores/product'

const emit = defineEmits(['volver'])
const productStore = useProductStore()

const nombre = ref('')
const foto = ref('')
const descripcion = ref('')
const precio = ref<number | null>(null)
const stock = ref<number | null>(null)
const categoria = ref('')
const estado = ref<'Disponible' | 'Agotado'>('Disponible')

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

const registrarProducto = async () => {
  if (!nombre.value || precio.value === null || stock.value === null || !categoria.value) {
    alert('Por favor, completa todos los campos obligatorios.')
    return
  }

  await productStore.registerProducto({
    nombre: nombre.value,
    foto: foto.value,
    descripcion: descripcion.value,
    precio: precio.value,
    stock: stock.value,
    categoria: categoria.value,
    estado: estado.value
  })

  alert('Producto Registrado correctamente')

  emit('volver')
}
</script>

<style scoped>
.register-form {
  max-width: 500px;
  margin: 0 auto;
}
</style>
