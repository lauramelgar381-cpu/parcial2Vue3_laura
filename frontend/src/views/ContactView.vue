<script setup>
import { ref } from 'vue';
import api from '@/services/api.js';

const email = ref('');
const mensaje = ref('');
const errores = ref({});
const enviado = ref(false);
const errorEnvio = ref('');
const cargando = ref(false);

const direccion = 'Intersección NorOriente, Carretera a Los Planes de Renderos y Autopista a Comalapa, Km. 3, Bo. San Jacinto, San Salvador, El Salvador';

function validar() {
  errores.value = {};
  if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
    errores.value.email = 'Email inválido';
  }
  if (!mensaje.value || mensaje.value.length < 10) {
    errores.value.mensaje = 'El mensaje debe tener al menos 10 caracteres';
  }
  return Object.keys(errores.value).length === 0;
}

async function enviarMensaje() {
  enviado.value = false;
  errorEnvio.value = '';
  if (!validar()) return;

  cargando.value = true;
  try {
    await api.post('/contacto', { email: email.value, mensaje: mensaje.value });
    enviado.value = true;
    email.value = '';
    mensaje.value = '';
  } catch (error) {
    errorEnvio.value = error.response?.data?.error || 'Error al enviar el mensaje';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div>
      <h1 class="text-2xl font-display mb-1">Contacto</h1>
      <p class="text-base-content/60 text-sm">Comunícate con nosotros o visítanos</p>
    </div>

    <div v-if="enviado" class="alert alert-success">Mensaje enviado correctamente</div>
    <div v-if="errorEnvio" class="alert alert-error">{{ errorEnvio }}</div>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <h2 class="card-title text-base">Información de contacto</h2>
            <ul class="space-y-3 mt-2 text-sm">
              <li class="flex items-start gap-3">
                <i class="pi pi-map-marker text-primary mt-1"></i>
                <span>{{ direccion }}</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="pi pi-phone text-primary"></i>
                <span>(503) 2133-2600</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="pi pi-envelope text-primary"></i>
                <span>citasmedicas@test.com</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="pi pi-clock text-primary"></i>
                <span>Lunes a viernes, 8:00 a.m. – 5:00 p.m.</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="card bg-base-100 border border-base-300 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.7094387608895!2d-89.1965569262549!3d13.675423899059918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f63311954327075%3A0x28682274f5650dd1!2sUniversidad%20Luterana%20Salvadore%C3%B1a!5e0!3m2!1ses!2ssv!4v1790350624470!5m2!1ses!2ssv"
            class="w-full h-64 border-0"
            allowfullscreen
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            title="Ubicación"
          ></iframe>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <form @submit.prevent="enviarMensaje" class="card-body">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Correo electrónico</legend>
            <input v-model="email" type="email" placeholder="correo@ejemplo.com" class="input input-bordered w-full" />
            <p v-if="errores.email" class="text-xs text-error mt-1">{{ errores.email }}</p>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Mensaje</legend>
            <textarea v-model="mensaje" class="textarea textarea-primary w-full" rows="5" placeholder="Escribe tu mensaje"></textarea>
            <p v-if="errores.mensaje" class="text-xs text-error mt-1">{{ errores.mensaje }}</p>
          </fieldset>

          <button type="submit" :disabled="cargando" class="btn btn-primary w-full mt-2">
            {{ cargando ? 'Enviando...' : 'Enviar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>