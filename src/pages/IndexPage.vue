<template>
  <NavBar/>
  <q-page class="row items-center justify-evenly">
    <!-- Add your content here -->
    <div>
      <h1>Hello, Quasar!</h1>

      <ListProduct/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  // Your script content here
import NavBar  from 'src/components/NavBar.vue';
import ListProduct from 'src/components/producto/ListProduct.vue';
</script>
