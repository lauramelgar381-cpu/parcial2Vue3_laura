<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const cargando = ref(false)
const error = ref('')

async function iniciarSesion() {
  error.value = ''
  cargando.value = true
  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (e) {
    error.value = e?.response?.data?.error || 'Credenciales inválidas, intenta de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-neutral px-4">
    <div class="card w-full max-w-md bg-base-100 border border-base-300">
      <form @submit.prevent="iniciarSesion" class="card-body">
        <div class="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center mb-2">
          <i class="pi pi-heart-fill text-lg"></i>
        </div>
        <h3 class="text-3xl font-display">Iniciar sesión</h3>
        <p class="text-base-content/60 mb-2">Ingresa tu correo y contraseña</p>

        <div v-if="error" class="alert alert-error text-sm py-2">{{ error }}</div>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Correo electrónico</legend>
          <input
            v-model="email"
            type="email"
            required
            placeholder="correo@ejemplo.com"
            class="input input-bordered w-full"
          />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Contraseña</legend>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Ingresa tu contraseña"
            class="input input-bordered w-full"
          />
        </fieldset>

        <button type="submit" :disabled="cargando" class="btn btn-primary w-full mt-4">
          {{ cargando ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>

        <p class="text-sm text-center pt-2">
          ¿No tienes cuenta?
          <RouterLink to="/register" class="font-bold link link-primary">Crear una cuenta</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>