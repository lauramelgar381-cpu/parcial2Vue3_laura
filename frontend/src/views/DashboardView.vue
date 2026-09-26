<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';
import { useToastStore } from '@/stores/toast.store.js';

const toastStore = useToastStore();
const citasPorEstado = ref([]);
const citasPorDoctor = ref([]);

const badgePorEstado = {
  PENDIENTE: 'badge-warning',
  CONFIRMADA: 'badge-info',
  CANCELADA: 'badge-error',
  REPROGRAMADA: 'badge-primary',
};

async function cargarReportes() {
  const [estadoRes, doctorRes] = await Promise.all([
    api.get('/reportes/citas-por-estado'),
    api.get('/reportes/citas-por-doctor'),
  ]);
  citasPorEstado.value = estadoRes.data;
  citasPorDoctor.value = doctorRes.data;
}

onMounted(cargarReportes);
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center gap-3">
      <div class="bg-primary text-primary-content rounded-full p-3">
        <i class="pi pi-th-large text-xl"></i>
      </div>
      <div>
        <h1 class="text-2xl font-display">Dashboard</h1>
        <p class="text-base-content/60 text-sm">Resumen general del sistema</p>
      </div>
    </div>

    <div class="stats border border-base-300 w-full stats-vertical sm:stats-horizontal">
      <div class="stat">
        <div class="stat-figure text-primary">
          <i class="pi pi-calendar text-2xl"></i>
        </div>
        <div class="stat-title">Citas por estado</div>
        <div class="flex flex-col gap-2 mt-3">
          <div v-for="item in citasPorEstado" :key="item.estado" class="flex items-center justify-between gap-4">
            <span class="badge badge-sm" :class="badgePorEstado[item.estado] || 'badge-ghost'">{{ item.estado }}</span>
            <span class="font-semibold">{{ item._count.estado }}</span>
          </div>
          <p v-if="citasPorEstado.length === 0" class="text-sm text-base-content/40">Sin datos aún</p>
        </div>
      </div>
      <div class="stat">
        <div class="stat-figure text-primary">
          <i class="pi pi-user text-2xl"></i>
        </div>
        <div class="stat-title">Citas por doctor</div>
        <div class="flex flex-col gap-1 mt-3">
          <div v-for="item in citasPorDoctor" :key="item.doctor" class="text-sm flex justify-between gap-4">
            <span class="text-base-content/70">{{ item.doctor }}</span>
            <span class="font-bold">{{ item.totalCitas }}</span>
          </div>
          <p v-if="citasPorDoctor.length === 0" class="text-sm text-base-content/40">Sin datos aún</p>
        </div>
      </div>
    </div>
  </div>
</template>