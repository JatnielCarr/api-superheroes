import express from "express";
import { check, validationResult } from 'express-validator';
import petService from "../services/petService.js";
import Pet from "../models/petModel.js";

const router = express.Router();

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Obtiene todas las mascotas
 *     tags: [Mascotas]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 */
router.get("/pets", async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Crea una nueva mascota
 *     tags: [Mascotas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: Mascota creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Error de validación
 */
router.post("/pets",
    [
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('type').not().isEmpty().withMessage('El tipo es requerido')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        try {
            const { name, type, ownerId } = req.body;
            const newPet = new Pet(null, name, type, ownerId);
            const addedPet = await petService.addPet(newPet);
            res.status(201).json(addedPet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Actualiza una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Mascota no encontrada
 */
router.put("/pets/:id", async (req, res) => {
    try {
        const updatedPet = await petService.updatePet(req.params.id, req.body);
        res.json(updatedPet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Elimina una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/pets/:id', async (req, res) => {
    try {
        const result = await petService.deletePet(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /pets/{id}/owner:
 *   put:
 *     summary: Asigna un dueño (héroe) a la mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId:
 *                 type: integer
 *                 description: ID del héroe dueño
 *     responses:
 *       200:
 *         description: Mascota actualizada con dueño
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Mascota no encontrada
 */
router.put('/pets/:id/owner', async (req, res) => {
    try {
        const { ownerId } = req.body;
        const updatedPet = await petService.assignOwner(req.params.id, ownerId);
        res.json(updatedPet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// --- ENDPOINTS DE CUIDADO DE MASCOTAS ---
/**
 * @swagger
 * /mascotas/{id}/alimentar:
 *   post:
 *     summary: Alimenta a la mascota con el ID especificado
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota alimentada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 estado:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/alimentar', async (req, res) => {
    try {
        const pet = await petService.alimentarPet(req.params.id);
        res.json({ mensaje: 'Mascota alimentada con éxito', estado: pet.estado });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /mascotas/{id}/banar:
 *   post:
 *     summary: Baña a la mascota con el ID especificado
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota bañada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 estado:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/banar', async (req, res) => {
    try {
        const pet = await petService.banarPet(req.params.id);
        res.json({ mensaje: 'Mascota bañada con éxito', estado: pet.estado });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /mascotas/{id}/pasear:
 *   post:
 *     summary: Saca a pasear a la mascota con el ID especificado
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota paseada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 estado:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/pasear', async (req, res) => {
    try {
        const pet = await petService.pasearPet(req.params.id);
        res.json({ mensaje: 'Mascota paseada con éxito', estado: pet.estado });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /mascotas/{id}/jugar:
 *   post:
 *     summary: Juega con la mascota con el ID especificado
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota jugada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 estado:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/jugar', async (req, res) => {
    try {
        const pet = await petService.jugarPet(req.params.id);
        res.json({ mensaje: 'Mascota jugada con éxito', estado: pet.estado });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /mascotas/{id}/estado:
 *   get:
 *     summary: Obtiene el estado actual de la mascota con el ID especificado
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Estado actual de la mascota
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/mascotas/:id/estado', async (req, res) => {
    try {
        const estado = await petService.getEstadoPet(req.params.id);
        res.json(estado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado
 *         name:
 *           type: string
 *           description: Nombre de la mascota
 *         type:
 *           type: string
 *           description: Tipo de mascota (perro, gato, etc.)
 *         ownerId:
 *           type: integer
 *           description: ID del héroe dueño
 *       example:
 *         id: 1
 *         name: Krypto
 *         type: Perro
 *         ownerId: 1
 */

export default router; 