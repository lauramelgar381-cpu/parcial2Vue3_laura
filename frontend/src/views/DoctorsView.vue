<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';
import { useToastStore } from '@/stores/toast.store.js';
import DoctorForm from '@/components/DoctorForm.vue';

const doctores = ref([]);
const cargando = ref(false);
const dialogRef = ref(null);
const toastStore = useToastStore();
const doctorEditar = ref(null);

async function cargarDoctores() {
  cargando.value = true;
  try {
    const { data } = await api.get('/doctores');
    doctores.value = data;
  } finally {
    cargando.value = false;
  }
}

onMounted(cargarDoctores);

function abrirCrear() {
  doctorEditar.value = null;
  dialogRef.value.showModal();
}

function abrirEditar(doctor) {
  doctorEditar.value = doctor;
  dialogRef.value.showModal();
}

async function guardar(datos) {
  try {
    if (doctorEditar.value) {
      await api.put(`/doctores/${doctorEditar.value.id}`, datos);
      toastStore.success('Doctor actualizado');
    } else {
      await api.post('/doctores', datos);
      toastStore.success('Doctor creado');
    }
    dialogRef.value.close();
    await cargarDoctores();
  } catch (error) {
    toastStore.error(error.response?.data?.error || 'Error al guardar');
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este doctor?')) return;
  try {
    await api.delete(`/doctores/${id}`);
    toastStore.success('Doctor eliminado');
    await cargarDoctores();
  } catch (error) {
    toastStore.error(error.response?.data?.error || 'Error al eliminar');
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center gap-3">
      <div class="bg-primary text-primary-content rounded-full p-3">
        <i class="pi pi-user text-xl"></i>
      </div>
      <div>
        <h1 class="text-2xl font-display">Doctores</h1>
        <p class="text-base-content/60 text-sm">Gestiona el personal médico del sistema</p>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <span class="badge badge-outline">{{ doctores.length }} doctores</span>
      <button class="btn btn-primary btn-sm" @click="abrirCrear">
        <i class="pi pi-plus"></i> Nuevo doctor
      </button>
    </div>

    <div v-if="cargando" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="doctores.length === 0" class="card bg-base-100 border border-base-300">
      <div class="card-body items-center text-center py-12 text-base-content/50">
        <i class="pi pi-user text-4xl mb-2"></i>
        <p>Aún no hay doctores registrados</p>
      </div>
    </div>

    <div v-else class="card bg-base-100 border border-base-300 overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Especialidad</th>
            <th>Contacto</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in doctores" :key="d.id" class="hover">
            <td>
              <div class="flex items-center gap-3">
                <div class="avatar avatar-placeholder">
                  <div class="bg-primary text-primary-content rounded-full w-9">
                    <span class="text-xs font-semibold">{{ d.nombre?.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase() }}</span>
                  </div>
                </div>
                <span class="font-medium">{{ d.nombre }}</span>
              </div>
            </td>
            <td><span class="badge badge-outline badge-primary">{{ d.especialidad }}</span></td>
            <td class="text-base-content/70 text-sm">
              <div>{{ d.email }}</div>
              <div>{{ d.telefono }}</div>
            </td>
            <td class="text-right">
              <button class="btn btn-ghost btn-xs" @click="abrirEditar(d)"><i class="pi pi-pencil"></i></button>
              <button class="btn btn-ghost btn-xs text-error" @click="eliminar(d.id)"><i class="pi pi-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog ref="dialogRef" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-display mb-4">{{ doctorEditar ? 'Editar doctor' : 'Nuevo doctor' }}</h3>
        <DoctorForm :doctorEditar="doctorEditar" @guardar="guardar" @cancelar="dialogRef.close()" />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>cerrar</button>
      </form>
    </dialog>
  </div>
</template>