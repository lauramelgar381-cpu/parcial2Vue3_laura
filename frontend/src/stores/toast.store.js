import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const mensajes = ref([]);
  let contador = 0;

  function mostrar(texto, tipo = 'success', duracion = 3000) {
    const id = contador++;
    mensajes.value.push({ id, texto, tipo });
    setTimeout(() => {
      mensajes.value = mensajes.value.filter((m) => m.id !== id);
    }, duracion);
  }

  function success(texto, duracion) {
    mostrar(texto, 'success', duracion);
  }

  function error(texto, duracion = 4000) {
    mostrar(texto, 'error', duracion);
  }

  return { mensajes, success, error };
});