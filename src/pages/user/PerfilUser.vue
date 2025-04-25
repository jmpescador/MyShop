<template>

    <NavBar/>

    <div class="q-pa-md">
      <q-card class="q-pa-md q-mx-auto" style="max-width: 600px;">
        <div class="text-h5 q-mb-md">👤 Perfil de Usuario</div>
  
        <component
          v-if="user?.uid && user?.email && user?.password && user?.role && user?.estado"
          :is="modoEdicion ? EditarUser : ShowUser"
          :user="user"
          @editar="cambiarModo"
          @cancelar="cancelarEdicion"
        />
      </q-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import NavBar from 'src/components/NavBar.vue';
  import { ref, onMounted } from 'vue';
  import { useUserStore, type User } from 'src/stores/user';
  import ShowUser from 'src/components/user/ShowUser.vue';
  import EditarUser from 'src/components/user/EditarUser.vue';
  import { useAuthStore } from 'src/stores/auth';
  const authStore = useAuthStore();
  const uidAutenticado = authStore.user?.uid ?? '';
    
  const userStore = useUserStore();
  const modoEdicion = ref(false);

  
  // Cargar el usuario al montar
  onMounted(async () => {
    await userStore.fetchUsuario(uidAutenticado);
    user.value = { ...userStore.selectedUser } as User;
  });
  
  // Copia local del usuario para edición
  const user = ref<User>({
    uid: '',
    email: '',
    password: '',
    role: 'user',
    estado: 'Activo',
  });
  
  const cambiarModo = () => {
    modoEdicion.value = true;
  };
  
  const cancelarEdicion = () => {
    if (userStore.selectedUser) {
      user.value = { ...userStore.selectedUser };
    }
    modoEdicion.value = false;
  };
  </script>
  