<script setup>
import { ref, onMounted } from 'vue';
import { usePacientesStore } from '@/stores/pacientes.store.js';
import { useToastStore } from '@/stores/toast.store.js';
import PacienteForm from '@/components/PacienteForm.vue';

const pacientesStore = usePacientesStore();
const toastStore = useToastStore();
const dialogRef = ref(null);
const pacienteEditar = ref(null);

onMounted(() => pacientesStore.obtenerPacientes());

function abrirCrear() {
  pacienteEditar.value = null;
  dialogRef.value.showModal();
}

function abrirEditar(paciente) {
  pacienteEditar.value = paciente;
  dialogRef.value.showModal();
}

async function guardar(datos) {
  try {
    if (pacienteEditar.value) {
      await pacientesStore.actualizarPaciente(pacienteEditar.value.id, datos);
      toastStore.success('Paciente actualizado');
    } else {
      await pacientesStore.crearPaciente(datos);
      toastStore.success('Paciente creado');
    }
    dialogRef.value.close();
  } catch (error) {
    toastStore.error(error.response?.data?.error || 'Error al guardar');
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este paciente?')) return;
  try {
    await pacientesStore.eliminarPaciente(id);
    toastStore.success('Paciente eliminado');
  } catch (error) {
    toastStore.error(error.response?.data?.error || 'Error al eliminar');
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center gap-3">
      <div class="bg-primary text-primary-content rounded-full p-3">
        <i class="pi pi-users text-xl"></i>
      </div>
      <div>
        <h1 class="text-2xl font-display">Pacientes</h1>
        <p class="text-base-content/60 text-sm">Gestiona los pacientes registrados en el sistema</p>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <span class="badge badge-outline">{{ pacientesStore.pacientes.length }} pacientes</span>
      <button class="btn btn-primary btn-sm" @click="abrirCrear">
        <i class="pi pi-plus"></i> Nuevo paciente
      </button>
    </div>

    <div v-if="pacientesStore.cargando" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="pacientesStore.pacientes.length === 0" class="card bg-base-100 border border-base-300">
      <div class="card-body items-center text-center py-12 text-base-content/50">
        <i class="pi pi-users text-4xl mb-2"></i>
        <p>Aún no hay pacientes registrados</p>
      </div>
    </div>

    <div v-else class="card bg-base-100 border border-base-300 overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Contacto</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pacientesStore.pacientes" :key="p.id" class="hover">
            <td>
              <div class="flex items-center gap-3">
                <div class="avatar avatar-placeholder">
                  <div class="bg-primary text-primary-content rounded-full w-9">
                    <span class="text-xs font-semibold">{{ p.nombre?.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() }}</span>
                  </div>
                </div>
                <span class="font-medium">{{ p.nombre }}</span>
              </div>
            </td>
            <td class="text-base-content/70 text-sm">
              <div>{{ p.email }}</div>
              <div>{{ p.telefono }}</div>
            </td>
            <td class="text-right">
              <button class="btn btn-ghost btn-xs" @click="abrirEditar(p)"><i class="pi pi-pencil"></i></button>
              <button class="btn btn-ghost btn-xs text-error" @click="eliminar(p.id)"><i class="pi pi-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog ref="dialogRef" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-display mb-4">{{ pacienteEditar ? 'Editar paciente' : 'Nuevo paciente' }}</h3>
        <PacienteForm :pacienteEditar="pacienteEditar" @guardar="guardar" @cancelar="dialogRef.close()" />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>cerrar</button>
      </form>
    </dialog>
  </div>
</template>