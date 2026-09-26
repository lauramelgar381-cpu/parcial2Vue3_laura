export function manejarErrores(err, req, res, next) {
  console.error(err);

  // Error de restricción única de Prisma (ej: email duplicado)
  if (err.code === 'P2002') {
    const campo = err.meta?.target?.[0] || 'campo';
    return res.status(409).json({ error: `Ya existe un registro con ese ${campo}` });
  }

  // Error de registro no encontrado (ej: intentar actualizar/eliminar un ID que no existe)
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro no encontrado' });
  }

  // Cualquier otro error no controlado
  res.status(500).json({ error: 'Error interno del servidor' });
}