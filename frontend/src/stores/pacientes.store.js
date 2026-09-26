import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api.js';

export const usePacientesStore = defineStore('pacientes', () => {
  const pacientes = ref([]);
  const pacienteActual = ref(null);
  const cargando = ref(false);

  async function obtenerPacientes() {
    cargando.value = true;
    try {
      const { data } = await api.get('/pacientes');
      pacientes.value = data;
    } finally {
      cargando.value = false;
    }
  }

  async function obtenerPaciente(id) {
    const { data } = await api.get(`/pacientes/${id}`);
    pacienteActual.value = data;
    return data;
  }

  async function crearPaciente(datos) {
    const { data } = await api.post('/pacientes', datos);
    pacientes.value.push(data);
    return data;
  }

  async function actualizarPaciente(id, datos) {
    const { data } = await api.put(`/pacientes/${id}`, datos);
    const index = pacientes.value.findIndex((p) => p.id === id);
    if (index !== -1) pacientes.value[index] = data;
    return data;
  }

  async function eliminarPaciente(id) {
    await api.delete(`/pacientes/${id}`);
    pacientes.value = pacientes.value.filter((p) => p.id !== id);
  }

  return {
    pacientes,
    pacienteActual,
    cargando,
    obtenerPacientes,
    obtenerPaciente,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
  };
});