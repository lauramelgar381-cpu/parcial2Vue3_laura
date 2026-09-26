<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';

const router = useRouter();
const authStore = useAuthStore();

const nombre = ref('');
const email = ref('');
const password = ref('');
const confirmarPassword = ref('');
const errores = ref({});
const errorRegistro = ref('');
const cargando = ref(false);

function validar() {
  errores.value = {};
  if (!nombre.value || nombre.value.length < 2) {
    errores.value.nombre = 'El nombre debe tener al menos 2 caracteres';
  }
  if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
    errores.value.email = 'Email inválido';
  }
  if (!password.value || password.value.length < 6) {
    errores.value.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  if (password.value !== confirmarPassword.value) {
    errores.value.confirmarPassword = 'Las contraseñas no coinciden';
  }
  return Object.keys(errores.value).length === 0;
}

async function manejarRegistro() {
  errorRegistro.value = '';
  if (!validar()) return;

  cargando.value = true;
  try {
    await authStore.registrar({ nombre: nombre.value, email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (error) {
    errorRegistro.value = error.response?.data?.error || 'Error al registrar';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-neutral px-4">
    <div class="card w-full max-w-md bg-base-100 border border-base-300">
      <div class="card-body">
        <div class="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center mb-2">
          <i class="pi pi-heart-fill text-lg"></i>
        </div>
        <h3 class="text-3xl font-display">Crea tu cuenta</h3>

        <div v-if="errorRegistro" class="alert alert-error text-sm py-2">{{ errorRegistro }}</div>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Nombre completo</legend>
          <input v-model="nombre" type="text" placeholder="Tu nombre" class="input input-bordered w-full" />
          <p v-if="errores.nombre" class="text-xs text-error mt-1">{{ errores.nombre }}</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Correo electrónico</legend>
          <input v-model="email" type="email" placeholder="correo@ejemplo.com" class="input input-bordered w-full" />
          <p v-if="errores.email" class="text-xs text-error mt-1">{{ errores.email }}</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Contraseña</legend>
          <input v-model="password" type="password" placeholder="Contraseña" class="input input-bordered w-full" />
          <p v-if="errores.password" class="text-xs text-error mt-1">{{ errores.password }}</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Confirmar contraseña</legend>
          <input v-model="confirmarPassword" type="password" placeholder="Confirmar contraseña" class="input input-bordered w-full" />
          <p v-if="errores.confirmarPassword" class="text-xs text-error mt-1">{{ errores.confirmarPassword }}</p>
        </fieldset>

        <button
          type="button"
          :disabled="cargando"
          @click="manejarRegistro"
          class="btn btn-primary w-full mt-4"
        >
          {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
        </button>

        <p class="text-sm text-center pt-2">
          ¿Ya tienes cuenta?
          <RouterLink to="/login" class="font-bold link link-primary">Inicia sesión</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>