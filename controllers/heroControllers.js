import express from "express";
import { check, validationResult } from 'express-validator';
import HeroService from "../services/heroService.js";
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const heroService = new HeroService();

/**
 * @swagger
 * /heroes:
 *   get:
 *     summary: Obtiene todos los héroes
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de héroes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hero'
 */
router.get("/heroes", authMiddleware, async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes(req.user);
        res.json(heroes);
    } catch (error) {
        if (error.status === 403) return res.status(403).json({ error: error.message });
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/city/{city}:
 *   get:
 *     summary: Obtiene héroes por ciudad
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Ciudad a filtrar
 *     responses:
 *       200:
 *         description: Lista de héroes filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hero'
 */
router.get('/heroes/city/:city', authMiddleware, async (req, res) => {
    try {
        const heroes = await heroService.findHeroesByCity(req.params.city, req.user._id);
        res.json(heroes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /heroes:
 *   post:
 *     summary: Crea un nuevo héroe
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hero'
 *     responses:
 *       201:
 *         description: Héroe creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hero'
 *       400:
 *         description: Error de validación
 */
router.post("/heroes",
    [
        authMiddleware,
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('alias').not().isEmpty().withMessage('El alias es requerido')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.array() });
        }
        try {
            const { name, alias, city, team } = req.body;
            const addedHero = await heroService.addHero({ name, alias, city, team, owner: req.user._id });
            res.status(201).json(addedHero);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

/**
 * @swagger
 * /heroes/{id}:
 *   put:
 *     summary: Actualiza un héroe
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hero'
 *     responses:
 *       200:
 *         description: Héroe actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hero'
 *       404:
 *         description: Héroe no encontrado
 */
router.put("/heroes/:heroId", authMiddleware, async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.heroId, req.body, req.user._id);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/{id}:
 *   delete:
 *     summary: Elimina un héroe
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     responses:
 *       200:
 *         description: Héroe eliminado
 *       404:
 *         description: Héroe no encontrado
 */
router.delete('/heroes/:heroId', authMiddleware, async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.heroId, req.user._id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/{id}/enfrentar:
 *   post:
 *     summary: Enfrenta un héroe a un villano
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               villain:
 *                 type: string
 *                 description: Nombre del villano
 *     responses:
 *       200:
 *         description: Resultado del enfrentamiento
 *       404:
 *         description: Héroe no encontrado
 */
router.post('/heroes/:heroId/enfrentar', authMiddleware, async (req, res) => {
    try {
        const result = await heroService.faceVillain(req.params.heroId, req.body.villain, req.user._id);
        res.json({ message: result });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

/**
 * @swagger
 * /heroes/{id}/pets:
 *   get:
 *     summary: Obtiene las mascotas de un héroe
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Héroe no encontrado
 */
router.get('/heroes/:heroId/pets', authMiddleware, async (req, res) => {
    try {
        const pets = await heroService.getHeroPets(req.params.heroId, req.user._id);
        res.json(pets);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Hero:
 *       type: object
 *       required:
 *         - name
 *         - alias
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado
 *         name:
 *           type: string
 *           description: Nombre real del héroe
 *         alias:
 *           type: string
 *           description: Nombre de superhéroe
 *         city:
 *           type: string
 *           description: Ciudad
 *         team:
 *           type: string
 *           description: Equipo o grupo
 *       example:
 *         id: 1
 *         name: Roberto Gómez Bolaños
 *         alias: Chapulin Colorado
 *         city: CDMX
 *         team: Independiente
 */
export default router;
