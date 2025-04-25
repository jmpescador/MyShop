<template>
    <q-page class="register-page">
      <h2 class="form-title">Login</h2>
  
      <q-form @submit.prevent="Login" class="form-container">
        <q-input
          v-model="email"
          label="Email"
          type="email"
          outlined
          :error="emailError !== ''"
          :error-message="emailError"
        />
  
        <q-input
          v-model="password"
          label="Contraseña"
          type="password"
          outlined
          :error="passwordError !== ''"
          :error-message="passwordError"
        />
  
        <q-btn
          label="Login"
          type="submit"
          color="primary"
          class="submit-btn"
        />
      </q-form>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth';
  import { FirebaseError } from 'firebase/app';
  
  // Campos del formulario
  const email = ref('');
  const password = ref('');
  
  // Manejo de errores
  const emailError = ref('');
  const passwordError = ref('');
  
  // Instancias
  const router = useRouter();
  const auth = useAuthStore();
  
  // Función para iniciar sesión
  const Login = async () => {
    // Limpiar errores anteriores
    emailError.value = '';
    passwordError.value = '';
  
    // Validaciones básicas
    if (!email.value) {
      emailError.value = 'El email es obligatorio.';
      return;
    }
  
    if (!password.value) {
      passwordError.value = 'La contraseña es obligatoria.';
      return;
    }
  
    // Intento de login
    try {
      await auth.login(email.value, password.value);
      alert('Usuario logueado exitosamente');
      await router.push('/');
    } catch (error: unknown) {
      // Manejo de errores de Firebase
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/invalid-email':
            emailError.value = 'Email no válido o no registrado.';
            break;
          case 'auth/wrong-password':
            passwordError.value = 'Contraseña incorrecta.';
            break;
          default:
            alert('Error al iniciar sesión: ' + error.message);
        }
      } else if (error instanceof Error) {
        // Captura los errores lanzados manualmente desde el store (como "cuenta inactiva")
        alert(error.message);
      } else {
        alert('Error desconocido al iniciar sesión.');
      }
    } 
  };
  </script>
  
  <style lang="scss" scoped>
  .register-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
  
    .form-title {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: #333;
    }
  
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
  
    .submit-btn {
      margin-top: 1rem;
      font-weight: bold;
      border-radius: 8px;
    }
  }
  </style>
  