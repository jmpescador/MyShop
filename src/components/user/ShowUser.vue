<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Detalle del Usuario</div>
      <p>Email: {{ user.email }}</p>
      <p>Password: {{ user.password }}</p>
      <p>Rol: {{ user.role }}</p>
      <p>Estado: {{ user.estado }}</p>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Editar" color="primary" @click="$emit('editar')" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
defineProps<{
  user: {
    uid: string
    email: string
    password: string
    role: 'admin' | 'user'
    estado: 'Activo' | 'Inactivo'
  }
}>()
</script>
