<template>
  <div class="q-pa-md q-gutter-md row items-start justify-center">
    <q-card
      v-for="producto in productosDisponibles"
      :key="producto.uid"
      class="q-mb-md card-producto"
      flat
      bordered
    >
      <q-img :src="producto.foto" :alt="producto.nombre" class="foto" />

      <q-card-section class="contenido">
        <div class="text-h6">{{ producto.nombre }}</div>
        <div class="text-subtitle2 text-grey-7">{{ producto.categoria }}</div>
        <div class="descripcion q-mt-sm">{{ producto.descripcion }}</div>
        <div class="text-h6 q-mt-sm">Precio: ${{ producto.precio }}</div>
        <div class="text-caption text-grey">Stock: {{ producto.stock }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Añadir al carrito"
          color="primary"
          @click="agregarAlCarrito(producto)"
          :disable="producto.stock === 0"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useProductStore } from 'src/stores/product';
import { useCarritoStore } from 'src/stores/carrito';
import { useAuthStore } from 'src/stores/auth'; // ✅ Importar el store de auth
import type { Producto } from 'src/stores/product';

const productStore = useProductStore();
const carritoStore = useCarritoStore();
const authStore = useAuthStore(); // ✅ Instanciar auth

onMounted(async () => {
  await productStore.fetchProductos();
});

const productosDisponibles = computed(() =>
  productStore.productos.filter(p => p.estado === 'Disponible')
);

const agregarAlCarrito = (producto: Producto) => {
  if (!authStore.user) {
    alert('Debes Loguearte para añadir al carrito')
    return;
  }else if(producto.stock === 0 ){
    alert('Producto agotado')
  }

  carritoStore.addProduct(producto);
};
</script>

<style scoped>
.foto {
  max-height: 150px;
  max-width: 150px;
  margin: 8px auto;
  display: block;
}

.card-producto {
  max-width: 300px;
  min-width: 300px;
  height: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
}
.card-producto:hover {
  transform: scale(1.02);
}

.contenido {
  flex-grow: 1;
}

.descripcion {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
