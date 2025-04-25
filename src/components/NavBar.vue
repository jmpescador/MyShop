<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>

      <q-toolbar-title>
        <q-btn flat dense to="/" label="MiTienda" class="text-white" />
      </q-toolbar-title>

      <!-- Botones para admin -->
      <q-btn
        v-if="isAdmin"
        flat
        dense
        to="/admin"
        icon="admin_panel_settings"
        label="Admin"
        class="q-mx-sm text-white"
      />

      <!-- Botones para usuario normal -->
      <template v-else-if="isUser">
        <q-btn
          flat
          dense
          to="/cart"
          icon="shopping_cart"
          label="Carrito"
          class="q-mx-sm text-white"
        />
        <q-btn
          flat
          dense
          to="/perfil"
          icon="person"
          label="Perfil"
          class="q-mx-sm text-white"
        />
      </template>

      <q-space />

      <!-- Botones de login/registro/logout -->
      <q-btn
        v-if="!isLoggedIn"
        flat
        dense
        to="/login"
        icon="login"
        label="Login"
        class="q-mx-sm text-white"
      />
      <q-btn
        v-if="!isLoggedIn"
        flat
        dense
        to="/register"
        icon="person_add"
        label="Registro"
        class="q-mx-sm text-white"
      />
      <q-btn
        v-if="isLoggedIn"
        flat
        dense
        icon="logout"
        label="Logout"
        @click="logout"
        class="q-mx-sm text-white"
      />
    </q-toolbar>
  </q-header>
</template>
<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const auth = useAuthStore();
const router = useRouter();

const logout = async () => {
  await auth.logout();
  await router.push('/');
};

const isLoggedIn = computed(() => auth.isLoggedIn);
const isAdmin = computed(() => auth.user?.role === 'admin');
const isUser = computed(() => auth.user?.role === 'user');
</script>
