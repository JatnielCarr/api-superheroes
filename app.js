import express from 'express';
import heroController from './controllers/heroControllers.js';
import petController from './controllers/petControllers.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import 'dotenv/config';
import connectDB from './db.js';
import adminController from './controllers/adminController.js';
import auth from './middleware/auth.js';
import bodyParser from 'body-parser';
import { loginHero } from './controllers/heroControllerAuth.js';

const app = express();

app.use(bodyParser.json());

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Superhéroes',
    version: '1.0.0',
    description: 'Documentación de la API de Superhéroes con Swagger',
  },
  servers: [
    {
      url: 'https://api-superheroes-production-c38b.up.railway.app/api',
      description: 'Railway Deploy',
    },
    {
      url: 'http://localhost:3001/api',
      description: 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autenticación de admin y obtención de token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
/**
 * @swagger
 * /verify:
 *   get:
 *     summary: Verifica si el token JWT es válido
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido o expirado
 */
// Rutas públicas
app.post('/api/login', adminController.login);
app.get('/api/verify', adminController.verify);
app.post('/api/login-hero', loginHero);

// Quitar el middleware global 'auth' para las rutas de héroes y mascotas
// app.use(auth); // ELIMINADO

// Rutas protegidas (cada router usará su propio middleware)
app.use('/api', heroController);
app.use('/api', petController);

const PORT = 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
