<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth.store.js';
import { useToastStore } from './stores/toast.store.js';

const authStore = useAuthStore();
const toastStore = useToastStore();
const router = useRouter();

function cerrarSesion() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="toast toast-top toast-end z-50">
    <div v-for="m in toastStore.mensajes" :key="m.id" class="alert" :class="m.tipo === 'error' ? 'alert-error' : 'alert-success'">
      <i class="pi" :class="m.tipo === 'error' ? 'pi-times-circle' : 'pi-check-circle'"></i>
      <span>{{ m.texto }}</span>
    </div>
  </div>
  <div class="drawer lg:drawer-open">
    <input id="main-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col">
      <div class="navbar bg-base-100 border-b border-base-300 lg:hidden">
        <label for="main-drawer" class="btn btn-square btn-ghost">
          <i class="pi pi-bars"></i>
        </label>
        <span class="text-lg font-display ml-2">Citas Médicas</span>
      </div>

      <main class="p-4 lg:p-8 pb-20 lg:pb-8">
        <RouterView />
      </main>

      <nav class="lg:hidden fixed bottom-0 left-0 right-0 btm-nav bg-base-100 border-t border-base-300">
        <RouterLink to="/" active-class="active text-primary">
          <i class="pi pi-home text-lg"></i>
          <span class="btm-nav-label text-xs">Inicio</span>
        </RouterLink>
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/patients" active-class="active text-primary">
            <i class="pi pi-users text-lg"></i>
            <span class="btm-nav-label text-xs">Pacientes</span>
          </RouterLink>
          <RouterLink to="/appointments" active-class="active text-primary">
            <i class="pi pi-calendar text-lg"></i>
            <span class="btm-nav-label text-xs">Citas</span>
          </RouterLink>
          <RouterLink to="/doctors" active-class="active text-primary">
            <i class="pi pi-user text-lg"></i>
            <span class="btm-nav-label text-xs">Doctores</span>
          </RouterLink>
          <RouterLink to="/dashboard" active-class="active text-primary">
            <i class="pi pi-th-large text-lg"></i>
            <span class="btm-nav-label text-xs">Panel</span>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/register" active-class="active text-primary">
            <i class="pi pi-user-plus text-lg"></i>
            <span class="btm-nav-label text-xs">Registro</span>
          </RouterLink>
          <RouterLink to="/login" active-class="active text-primary">
            <i class="pi pi-sign-in text-lg"></i>
            <span class="btm-nav-label text-xs">Entrar</span>
          </RouterLink>
        </template>
      </nav>
    </div>

    <div class="drawer-side">
      <label for="main-drawer" class="drawer-overlay"></label>
      <aside class="w-64 min-h-full bg-neutral text-neutral-content flex flex-col">
        <div class="px-6 py-5 flex items-center gap-3 border-b border-neutral-content/10">
          <div class="bg-primary text-primary-content rounded-full w-9 h-9 flex items-center justify-center shrink-0">
            <i class="pi pi-heart-fill text-sm"></i>
          </div>
          <span class="font-display text-lg leading-tight">Citas Médicas</span>
        </div>

        <ul class="menu p-4 flex-1 gap-1">
          <li>
            <RouterLink to="/" active-class="menu-active-item">
              <i class="pi pi-home"></i> Inicio
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/contact" active-class="menu-active-item">
              <i class="pi pi-envelope"></i> Contacto
            </RouterLink>
          </li>

          <template v-if="!authStore.isAuthenticated">
            <li>
              <RouterLink to="/register" active-class="menu-active-item">
                <i class="pi pi-user-plus"></i> Registro
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/login" active-class="menu-active-item">
                <i class="pi pi-sign-in"></i> Iniciar sesión
              </RouterLink>
            </li>
          </template>

          <template v-else>
            <li class="menu-title text-neutral-content/50 mt-2">Gestión</li>
            <li>
              <RouterLink to="/patients" active-class="menu-active-item">
                <i class="pi pi-users"></i> Pacientes
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/appointments" active-class="menu-active-item">
                <i class="pi pi-calendar"></i> Citas
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/doctors" active-class="menu-active-item">
                <i class="pi pi-user"></i> Doctores
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/dashboard" active-class="menu-active-item">
                <i class="pi pi-th-large"></i> Dashboard
              </RouterLink>
            </li>
          </template>
        </ul>

        <div v-if="authStore.isAuthenticated" class="p-4 border-t border-neutral-content/10">
          <button @click="cerrarSesion" class="btn btn-outline btn-error btn-sm w-full">
            <i class="pi pi-sign-out"></i> Cerrar sesión
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.menu li > a.menu-active-item,
.menu li > .menu-active-item {
  background-color: var(--color-primary);
  color: var(--color-primary-content);
}
</style>