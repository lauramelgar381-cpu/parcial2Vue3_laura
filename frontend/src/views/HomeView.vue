<script setup>
import { useAuthStore } from '@/stores/auth.store.js';

const authStore = useAuthStore();
</script>

<template>
  <div>
    <div class="hero bg-neutral text-neutral-content rounded-2xl py-20">
      <div class="hero-content text-center">
        <div class="max-w-xl">
          <div class="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
            <i class="pi pi-heart-fill text-2xl"></i>
          </div>
          <h1 class="text-4xl font-display">Sistema de Citas Médicas</h1>
          <p class="py-4 text-neutral-content/70">
            Gestiona pacientes, doctores y citas médicas en un solo lugar. Rápido, ordenado y siempre disponible.
          </p>
          <div class="flex justify-center gap-3">
            <template v-if="!authStore.isAuthenticated">
              <RouterLink to="/register" class="btn btn-primary">Crear cuenta</RouterLink>
              <RouterLink to="/login" class="btn btn-outline btn-neutral-content/40 text-neutral-content">Iniciar sesión</RouterLink>
            </template>
            <RouterLink v-else to="/dashboard" class="btn btn-primary">Ir al Dashboard</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body items-center text-center">
          <div class="bg-primary/15 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <i class="pi pi-users text-xl"></i>
          </div>
          <h3 class="card-title text-base">Gestión de pacientes</h3>
          <p class="text-sm text-base-content/60">Registra y actualiza el historial de tus pacientes fácilmente.</p>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body items-center text-center">
          <div class="bg-secondary/20 text-secondary rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <i class="pi pi-calendar text-xl"></i>
          </div>
          <h3 class="card-title text-base">Agenda de citas</h3>
          <p class="text-sm text-base-content/60">Agenda citas con validación de horarios y disponibilidad de doctores.</p>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body items-center text-center">
          <div class="bg-accent/25 text-neutral rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <i class="pi pi-chart-bar text-xl"></i>
          </div>
          <h3 class="card-title text-base">Reportes en tiempo real</h3>
          <p class="text-sm text-base-content/60">Visualiza estadísticas de citas por estado y por doctor.</p>
        </div>
      </div>
    </div>
  </div>
</template>