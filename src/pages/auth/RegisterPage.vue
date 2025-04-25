<template>
  <q-page class="register-page">

    <RegisterUsuario/>
    
  </q-page>
</template>

<script setup lang="ts">
import RegisterUsuario from 'src/components/admin/RegisterUsuario.vue';
</script>

<style scoped lang="scss">
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>