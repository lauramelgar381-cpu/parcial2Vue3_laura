import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Citas Médicas',
      version: '1.0.0',
      description: 'API REST para gestión de pacientes, doctores y citas médicas',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'], // lee las anotaciones JSDoc de las rutas
};

export const openapiSpec = swaggerJsdoc(options);