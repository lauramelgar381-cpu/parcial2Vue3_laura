import express from 'express';
import cors from 'cors';
import { apiReference } from '@scalar/express-api-reference';
import { openapiSpec } from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import pacienteRoutes from './routes/paciente.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import citaRoutes from './routes/cita.routes.js';
import reporteRoutes from './routes/reporte.routes.js';
import contactoRoutes from './routes/contacto.routes.js';

import { manejarErrores } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/api-docs', apiReference({ spec: { content: openapiSpec } }));

app.use('/api', authRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/doctores', doctorRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/contacto', contactoRoutes);
app.use(manejarErrores);

export default app;