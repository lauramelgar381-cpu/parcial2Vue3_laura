import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api.js';

export const useCitasStore = defineStore('citas', () => {
  const citas = ref([]);
  const citaActual = ref(null);
  const filtros = ref({ estado: null, doctorId: null });

  async function obtenerCitas() {
    const { data } = await api.get('/citas');
    citas.value = data;
  }

  async function agendarCita(datos) {
    const { data } = await api.post('/citas', datos);
    citas.value.push(data);
    return data;
  }

  async function actualizarEstadoCita(id, estado) {
    const { data } = await api.put(`/citas/${id}`, { estado });
    const index = citas.value.findIndex((c) => c.id === id);
    if (index !== -1) citas.value[index] = data;
    return data;
  }

  async function eliminarCita(id) {
    await api.delete(`/citas/${id}`);
    citas.value = citas.value.filter((c) => c.id !== id);
  }

  return { citas, citaActual, filtros, obtenerCitas, agendarCita, actualizarEstadoCita, eliminarCita };
});