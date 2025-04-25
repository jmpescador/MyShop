<template>
  <div class="register-container">
    <p class="form-title">Registrar Usuario</p>

    <q-form @submit.prevent="register" class="form-form">
      <q-input
        v-model="email"
        label="Email"
        type="email"
        outlined
        :error="emailError !== ''"
        :error-message="emailError"
        dense
      />

      <q-input
        v-model="password"
        label="Contraseña"
        type="password"
        outlined
        :error="passwordError !== ''"
        :error-message="passwordError"
        dense
      />

      <q-select
        v-if="auth.user?.role === 'admin'"
        v-model="role"
        :options="roles"
        label="Rol"
        outlined
        dense
      />

      <q-btn
        label="Registrar"
        type="submit"
        color="primary"
        class="submit-btn"
        unelevated
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { FirebaseError } from 'firebase/app';
import { useAuthStore } from 'src/stores/auth';

const auth = useAuthStore();

const email = ref('');
const password = ref('');
const role = ref<'admin' | 'user'>('user');
const roles = ['admin', 'user'];
const estado = 'Inactivo';

const emailError = ref('');
const passwordError = ref('');

watch(
  () => auth.user,
  (user) => {
    if (user?.role !== 'admin') {
      role.value = 'user';
    }
  },
  { immediate: true }
);

const register = async () => {
  if (password.value.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  emailError.value = '';
  passwordError.value = '';

  try {
    await auth.register(email.value, password.value, role.value, estado);
    alert('Usuario registrado correctamente');
  } catch (error: unknown) {
    if (
      error instanceof FirebaseError &&
      error.code === 'auth/email-already-in-use'
    ) {
      emailError.value = 'Este correo ya está registrado. Por favor, usa otro.';
    } else {
      console.error('Error durante el registro:', error);
    }
  }
};
</script>

<style scoped lang="scss">
.register-container {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
  margin: 1rem auto;
}

.form-title {
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.submit-btn {
  margin-top: 1rem;
  border-radius: 8px;
  font-weight: 600;
}
</style>
