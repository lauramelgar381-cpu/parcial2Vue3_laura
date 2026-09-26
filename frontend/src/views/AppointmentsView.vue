<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCitasStore } from '@/stores/citas.store.js';
import { usePacientesStore } from '@/stores/pacientes.store.js';
import { useToastStore } from '@/stores/toast.store.js';
import api from '@/services/api.js';

const citasStore = useCitasStore();
const pacientesStore = usePacientesStore();
const toastStore = useToastStore();
const doctores = ref([]);

const pacienteId = ref('');
const doctorId = ref('');
const fechaCita = ref('');
const errorForm = ref('');
const cargando = ref(false);

onMounted(async () => {
  await Promise.all([
    citasStore.obtenerCitas(),
    pacientesStore.obtenerPacientes(),
    api.get('/doctores').then((res) => (doctores.value = res.data)),
  ]);
});

const badgePorEstado = {
  PENDIENTE: 'badge-warning',
  CONFIRMADA: 'badge-info',
  CANCELADA: 'badge-error',
  REPROGRAMADA: 'badge-primary',
};

async function cambiarEstado(cita, nuevoEstado) {
  try {
    await citasStore.actualizarEstadoCita(cita.id, nuevoEstado);
    toastStore.success('Estado actualizado');
  } catch (error) {
    toastStore.error(error.response?.data?.error || 'Error al actualizar');
  }
}

async function eliminarCitaHandler(id) {
  if (!confirm('¿Eliminar esta cita?')) return;
  try {
    await citasStore.eliminarCita(id);
    toastStore.success('Cita eliminada');
  } catch (error) {
    toastStore.error(error.response?.data?.error || 'Error al eliminar');
  }
}

function iniciales(nombre) {
  if (!nombre) return '?';
  return nombre.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

async function agendar() {
  errorForm.value = '';
  if (!pacienteId.value || !doctorId.value || !fechaCita.value) {
    errorForm.value = 'Completa paciente, doctor y fecha';
    return;
  }

  cargando.value = true;
  try {
    await citasStore.agendarCita({
      pacienteId: Number(pacienteId.value),
      doctorId: Number(doctorId.value),
      fechaCita: new Date(fechaCita.value).toISOString(),
    });
    toastStore.success('Cita agendada correctamente');
    pacienteId.value = '';
    doctorId.value = '';
    fechaCita.value = '';
  } catch (error) {
    errorForm.value = error.response?.data?.error || 'Error al agendar la cita';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center gap-3">
      <div class="bg-primary text-primary-content rounded-full p-3">
        <i class="pi pi-calendar text-xl"></i>
      </div>
      <div>
        <h1 class="text-2xl font-display">Citas médicas</h1>
        <p class="text-base-content/60 text-sm">Agenda y da seguimiento a las citas del sistema</p>
      </div>
    </div>

    <div v-if="errorForm" class="alert alert-error">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ errorForm }}</span>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h2 class="card-title text-base">
          <i class="pi pi-plus-circle text-primary"></i>
          Nueva cita
        </h2>
        <div class="flex flex-wrap gap-4 items-end mt-2">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Paciente</legend>
            <select v-model="pacienteId" class="select select-bordered">
              <option disabled value="">Selecciona un paciente</option>
              <option v-for="p in pacientesStore.pacientes" :key="p.id" :value="p.id">
                {{ p.nombre }}
              </option>
            </select>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Doctor</legend>
            <select v-model="doctorId" class="select select-bordered">
              <option disabled value="">Selecciona un doctor</option>
              <option v-for="d in doctores" :key="d.id" :value="d.id">
                {{ d.nombre }}
              </option>
            </select>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Fecha y hora</legend>
            <input v-model="fechaCita" type="datetime-local" class="input input-bordered" />
          </fieldset>

          <button class="btn btn-primary" :disabled="cargando" @click="agendar">
            <i class="pi pi-calendar-plus" v-if="!cargando"></i>
            {{ cargando ? 'Agendando...' : 'Agendar cita' }}
          </button>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-display mb-4 flex items-center gap-2">
        <i class="pi pi-list text-base-content/50"></i>
        Citas agendadas
        <span class="badge badge-outline">{{ citasStore.citas.length }}</span>
      </h2>

      <div v-if="citasStore.citas.length === 0" class="card bg-base-100 border border-base-300">
        <div class="card-body items-center text-center py-12 text-base-content/50">
          <i class="pi pi-calendar text-4xl mb-2"></i>
          <p>Aún no hay citas agendadas</p>
        </div>
      </div>

      <div v-else class="card bg-base-100 border border-base-300 overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Doctor</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in citasStore.citas" :key="c.id" class="hover">
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar avatar-placeholder">
                    <div class="bg-primary text-primary-content rounded-full w-9">
                      <span class="text-xs font-semibold">{{ iniciales(c.paciente?.nombre) }}</span>
                    </div>
                  </div>
                  <span class="font-medium">{{ c.paciente?.nombre }}</span>
                </div>
              </td>
              <td>{{ c.doctor?.nombre }}</td>
              <td class="text-base-content/70">{{ new Date(c.fechaCita).toLocaleString() }}</td>
              <td>
                <select
                  class="select select-bordered select-xs"
                  :value="c.estado"
                  @change="cambiarEstado(c, $event.target.value)"
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="CONFIRMADA">CONFIRMADA</option>
                  <option value="CANCELADA">CANCELADA</option>
                  <option value="REPROGRAMADA">REPROGRAMADA</option>
                </select>
              </td>
              <td class="text-right">
                <button class="btn btn-ghost btn-xs text-error" @click="eliminarCitaHandler(c.id)">
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>