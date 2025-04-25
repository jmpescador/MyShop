<template>
    <NavBar />
  
    <div class="q-pa-md">
      <q-card class="q-pa-md">
        <div class="text-h5 q-mb-md">🛒 Productos en el Carrito</div>
  
        <q-table
          flat
          bordered
          :rows="carrito.productos"
          :columns="columns"
          row-key="uid"
          no-data-label="El carrito está vacío"
        >
          <template #body-cell-foto="props">
            <q-td>
              <q-img :src="props.row.foto" :alt="props.row.nombre" style="width: 50px; height: 50px;" />
            </q-td>
          </template>
  
          <template #body-cell-actions="props">
            <q-td class="q-gutter-sm">
              <q-btn color="green" label="Comprar" size="sm" @click="comprarProducto(props.row)" />
              <q-btn color="negative" icon="delete" size="sm" @click="eliminarProducto(props.row.uid)" />
            </q-td>
          </template>
        </q-table>
  
        <div v-if="carrito.productos.length > 0" class="q-mt-md flex justify-between items-center">
          <div class="text-subtitle1">
            Total: ${{ total }}
          </div>
          <q-btn color="warning" label="Vaciar carrito" @click="vaciarCarrito" />
        </div>
      </q-card>
    </div>
  </template>
  
  <script setup lang="ts">
import { computed } from 'vue';
import { useCarritoStore } from 'src/stores/carrito';
import { db } from 'src/boot/firebase'; // Asegúrate de tener Firebase configurado aquí
import NavBar from 'src/components/NavBar.vue';
import { ref, get, update } from 'firebase/database'; // asegúrate de importar de "firebase/database"

const carrito = useCarritoStore();

interface Producto {
  uid: string;
  nombre: string;
  cantidad: number;
  precio: number;
  foto: string;
}

const columns = [
  { name: 'foto', label: 'Imagen', align: 'left' as const, field: 'foto' },
  { name: 'nombre', label: 'Producto', align: 'left' as const, field: 'nombre' },
  { name: 'precio', label: 'Precio', align: 'left' as const, field: 'precio' },
  { name: 'cantidad', label: 'Cantidad', align: 'left' as const, field: 'cantidad' },
  { name: 'actions', label: 'Acciones', align: 'center' as const, field: 'actions' }
];

const eliminarProducto = (uid: string) => {
  carrito.deleteProduct(uid);
};

const vaciarCarrito = () => {
  carrito.vaciarCarrito();
};

const total = computed(() => {
  return carrito.productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
});


const comprarProducto = async (producto: Producto) => {
  try {
    const productoRef = ref(db, `productos/${producto.uid}`);
    const snap = await get(productoRef);

    if (!snap.exists()) {
      alert('Producto no encontrado en la base de datos.' );
      return;
    }

    const data = snap.val();
    const stockActual = data.stock;

    if (stockActual < producto.cantidad) {
      alert('No hay suficiente stock disponible.');
      return;
    }

    await update(productoRef, { stock: stockActual - producto.cantidad });

    carrito.deleteProduct(producto.uid);

    alert(` Compra realizada con éxito `);
  } catch (err) {
    console.error(err);
    alert('Error al procesar la compra.');
  }
};

</script>
