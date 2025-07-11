import express from 'express';
import heroController from './controllers/heroControllers.js';
import petController from './controllers/petControllers.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();

app.use(express.json());
app.use('/api', heroController);
app.use('/api', petController);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Superhéroes',
    version: '1.0.0',
    description: 'Documentación de la API de Superhéroes con Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
