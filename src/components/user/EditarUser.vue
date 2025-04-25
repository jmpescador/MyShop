<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Editar Usuario</div>
      <q-input v-model="form.email" label="Correo" />
      <q-input v-model="form.password" label="Contraseña" type="password" />
      <q-select v-model="form.role" :options="roles" label="Rol" />
      <q-select v-model="form.estado" :options="estados" label="Estado" />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Guardar" color="primary" @click="guardar" />
      <q-btn label="Cancelar" color="secondary" flat @click="emit('cancelar')" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { useUserStore} from 'src/stores/user';
import { ref } from 'vue'

const userStore = useUserStore()

const props = defineProps<{
  user: {
    uid: string
    email: string
    password: string
    role: 'admin' | 'user'
    estado: 'Activo' | 'Inactivo'
  }
}>()

const form = ref({ ...props.user })

const roles = ['admin', 'user']
const estados = ['Activo', 'Inactivo']

const emit = defineEmits(['cancelar'])

const guardar = async () => {
  await userStore.updateUsuario(form.value)
  console.log('Guardar usuario editado:', form.value)
  emit('cancelar')
}

</script>
