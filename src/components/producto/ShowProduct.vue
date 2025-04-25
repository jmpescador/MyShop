<template>
    <q-card>
      <q-card-section>
        <div class="text-h6">Detalle del Producto</div>
        <p>Nombre: {{ producto.nombre }}</p>
        <p>Foto: {{ producto.foto }}</p>
        <p>Descripcion: {{ producto.descripcion }}</p>
        <p>Precio: {{ producto.precio }}</p>
        <p>Stock: {{ producto.stock }}</p>
        <p>Categoria: {{ producto.categoria }}</p>
        <p>Estado: {{ producto.estado }}</p>
      </q-card-section>
  
      <q-card-actions align="right">
        <q-btn label="Volver" color="primary" @click="emit('volver')" />
      </q-card-actions>
    </q-card>
  </template>
  
  <script lang="ts" setup>
  defineProps<{
    producto: {
      nombre: string
      foto?: string
      descripcion: string
      precio: number
      stock: number
      categoria: string
      estado: 'Disponible' | 'Agotado'
    }
  }>()
  
  const emit = defineEmits(['volver'])
  </script>
  