<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  doctorEditar: { type: Object, default: null },
});
const emit = defineEmits(['guardar', 'cancelar']);

const form = ref({
  nombre: '', email: '', especialidad: '', telefono: '', cualificaciones: '',
});
const errores = ref({});

watch(
  () => props.doctorEditar,
  (doctor) => {
    if (doctor) {
      form.value = {
        nombre: doctor.nombre,
        email: doctor.email,
        especialidad: doctor.especialidad,
        telefono: doctor.telefono,
        cualificaciones: doctor.cualificaciones || '',
      };
    } else {
      form.value = { nombre: '', email: '', especialidad: '', telefono: '', cualificaciones: '' };
    }
  },
  { immediate: true }
);

function validar() {
  errores.value = {};
  if (!form.value.nombre || form.value.nombre.length < 2) errores.value.nombre = 'Nombre requerido';
  if (!/^\S+@\S+\.\S+$/.test(form.value.email)) errores.value.email = 'Email inválido';
  if (!form.value.especialidad) errores.value.especialidad = 'Especialidad requerida';
  if (!form.value.telefono || form.value.telefono.length < 8) errores.value.telefono = 'Teléfono requerido';
  return Object.keys(errores.value).length === 0;
}

function guardar() {
  if (!validar()) return;
  emit('guardar', { ...form.value });
}
</script>

<template>
  <form @submit.prevent="guardar" class="space-y-3">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Nombre</legend>
      <input v-model="form.nombre" type="text" class="input input-bordered w-full" />
      <p v-if="errores.nombre" class="text-xs text-error mt-1">{{ errores.nombre }}</p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Email</legend>
      <input v-model="form.email" type="email" class="input input-bordered w-full" />
      <p v-if="errores.email" class="text-xs text-error mt-1">{{ errores.email }}</p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Especialidad</legend>
      <input v-model="form.especialidad" type="text" class="input input-bordered w-full" />
      <p v-if="errores.especialidad" class="text-xs text-error mt-1">{{ errores.especialidad }}</p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Teléfono</legend>
      <input v-model="form.telefono" type="text" class="input input-bordered w-full" />
      <p v-if="errores.telefono" class="text-xs text-error mt-1">{{ errores.telefono }}</p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Cualificaciones</legend>
      <textarea v-model="form.cualificaciones" class="textarea textarea-bordered w-full" rows="3"></textarea>
    </fieldset>

    <div class="flex gap-2 pt-2">
      <button type="submit" class="btn btn-primary">Guardar</button>
      <button type="button" class="btn btn-ghost" @click="$emit('cancelar')">Cancelar</button>
    </div>
  </form>
</template>