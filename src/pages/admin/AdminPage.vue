<template>
  <NavBar />
  <q-page class="q-pa-md admin-page">
    <q-card>
      <q-card-section>
        <div class="text-h5">Panel de Administración</div>
      </q-card-section>

      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-2 text-primary"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="usuarios" label="Usuarios" icon="people" />
        <q-tab name="productos" label="Productos" icon="inventory_2" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="usuarios">
          <CrudUser />
        </q-tab-panel>

        <q-tab-panel name="productos">
          <CrudProduct />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import NavBar from 'src/components/NavBar.vue'
import CrudUser from 'components/admin/CrudUser.vue'
import { useUserStore } from 'src/stores/user'
import CrudProduct from 'src/components/admin/producto/CrudProduct.vue'

const tab = ref('usuarios')
const userStore = useUserStore()

watch(tab, async (nuevoTab) => {
  if (nuevoTab === 'usuarios') {
    await userStore.fetchUsuarios()
  }
})
</script>

<style scoped>
.admin-page .q-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.admin-page .q-card-section {
  padding-bottom: 0;
}

.admin-page .q-tabs {
  margin-top: -8px;
  width: 300px;
}

.admin-page .q-tab-panel {
  padding-top: 16px;
}
</style>
