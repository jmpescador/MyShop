<template>
  <q-page class="crud-usuarios-page">
    <ShowUser
      v-if="componenteActual === 'show' && usuarioSeleccionado"
      :user="usuarioSeleccionado"
      @volver="volver"
    />

    <EditarUser
      v-else-if="componenteActual === 'edit' && usuarioSeleccionado && usuarioActual?.uid === usuarioSeleccionado.uid"
      :user="usuarioSeleccionado"
      @volver="volver"
    />

    <RegisterUser
      v-else-if="componenteActual === 'register'"
    />

    <template v-else>
      <q-card>
        <q-card-section class="cabecera">
          <div class="titulo">Crud de Usuarios</div>

          <q-btn
            label="Registrar Usuario"
            color="primary"
            icon="person_add"
            class="q-mb-md q-mt-sm"
            @click="componenteActual = 'register'"
          />

          <div class="filtros">
            <div class="columna">
              <q-select
                v-model="filtroRol"
                label="Filtrar por Rol"
                :options="roles"
                emit-value
                map-options
                clearable
              />
            </div>

            <div class="columna">
              <q-select
                v-model="filtroEstado"
                label="Filtrar por Estado"
                :options="estados"
                emit-value
                map-options
                clearable
              />
            </div>
          </div>
        </q-card-section>

        <q-table
          :rows="usuariosFiltrados"
          :columns="columns"
          row-key="uid"
          flat
          bordered
          :loading="loading"
          loading-label="Cargando usuarios..."
          no-data-label="No hay usuarios registrados"
        >
          <template #body-cell-estado="props">
            <q-td align="left">
              <q-badge :color="props.row.estado === 'Activo' ? 'green' : 'red'">
                {{ props.row.estado }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-acciones="props">
            <q-td align="center">
              <q-btn flat round icon="visibility" color="primary" size="sm" @click="verUsuario(props.row)" />
              <q-btn flat round icon="delete" color="negative" size="sm" @click="eliminarUsuario(props.row.uid)" class="btn-accion" />
              <q-toggle
                :model-value="props.row.estado === 'Activo'"
                @update:model-value="val => toggleEstado(props.row, val)"
              />
              </q-td>
          </template>
        </q-table>
      </q-card>
    </template>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useAuthStore } from 'src/stores/auth'
import ShowUser from 'components/user/ShowUser.vue'
import EditarUser from 'components/user/EditarUser.vue'
import RegisterUser from 'components/admin/RegisterUsuario.vue'

interface User {
  uid: string
  email: string
  password: string
  role: 'admin' | 'user'
  estado: 'Activo' | 'Inactivo'
}

const userStore = useUserStore()
const authStore = useAuthStore()
const usuarioActual = computed(() => authStore.user)
const loading = ref(true)
const usuarios = userStore.usuarios

const columns = [
  { name: 'email', label: 'Correo', field: 'email', align: 'left' as const, sortable: true },
  { name: 'password', label: 'Contrase\u00f1a', field: 'password', align: 'left' as const, sortable: true },
  { name: 'role', label: 'Rol', field: 'role', align: 'left' as const, sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left' as const, sortable: true },
  { name: 'acciones', label: 'Acciones', field: () => '', align: 'center' as const, sortable: false }
]

const filtroRol = ref<string | null>(null)
const filtroEstado = ref<string | null>(null)

const roles = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Usuario', value: 'user' }
]

const estados = [
  { label: 'Activo', value: 'Activo' },
  { label: 'Inactivo', value: 'Inactivo' }
]

const usuariosFiltrados = computed(() => {
  return usuarios.filter((usuario) => {
    const porRol = filtroRol.value ? usuario.role === filtroRol.value : true
    const porEstado = filtroEstado.value ? usuario.estado === filtroEstado.value : true
    return porRol && porEstado
  })
})

const componenteActual = ref<'list' | 'show' | 'edit' | 'register'>('list')
const usuarioSeleccionado = ref<User | null>(null)

const verUsuario = (usuario: User) => {
  usuarioSeleccionado.value = usuario
  componenteActual.value = 'show'
}

const eliminarUsuario = async (uid: string) => {
  const usuario = usuarios.find((u) => u.uid === uid)
  if (!usuario) return

  const confirmado = confirm(`\u00bfEst\u00e1s seguro de eliminar el usuario "${usuario.email}"?`)
  if (confirmado) {
    await userStore.deleteUsuario(uid)
    await userStore.fetchUsuarios()
  }
}

const toggleEstado = async (usuario: User, nuevoValor: boolean) => {
  const nuevoEstado: 'Activo' | 'Inactivo' = nuevoValor ? 'Activo' : 'Inactivo'
  await userStore.updateEstadoUsuario(usuario.uid, nuevoEstado)
  usuario.estado = nuevoEstado
}

const volver = async () => {
  componenteActual.value = 'list'
  usuarioSeleccionado.value = null
  loading.value = true
  await userStore.fetchUsuarios()
  loading.value = false
}

onMounted(async () => {
  loading.value = true
  await userStore.fetchUsuarios()
  loading.value = false
})
</script>

<style scoped>
.crud-usuarios-page {
  padding: 16px;
}

.cabecera {
  padding-bottom: 0;
}

.titulo {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.filtros {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.columna {
  width: 100%;
}

.btn-accion {
  margin-left: 8px;
}

@media (min-width: 600px) {
  .filtros {
    flex-direction: row;
  }

  .columna {
    flex: 1;
  }
}
</style>
