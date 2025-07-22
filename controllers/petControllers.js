import express from "express";
import { check, validationResult } from 'express-validator';
import PetService from "../services/petService.js";
import authUniversal from '../middleware/authUniversal.js';

const router = express.Router();
const petService = new PetService();

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Obtiene todas las mascotas del usuario autenticado
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
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
router.get("/pets", authUniversal, async (req, res) => {
    try {
        const pets = await petService.getAllPets(req.user);
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Agrega una nueva mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Krypto"
 *               type:
 *                 type: string
 *                 example: "Perro"
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
        authUniversal,
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('type').not().isEmpty().withMessage('El tipo es requerido')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.array() });
        }
        try {
            const { name, type } = req.body;
            const addedPet = await petService.addPet({ name, type, ownerId: req.user._id });
            res.status(201).json(addedPet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

/**
 * @swagger
 * /pets/{petId}:
 *   put:
 *     summary: Actualiza una mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Krypto"
 *               type:
 *                 type: string
 *                 example: "Perro"
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
router.put("/pets/:petId", authUniversal, async (req, res) => {
    try {
        const updatedPet = await petService.updatePet(req.params.petId, req.body, req.user._id);
        res.json(updatedPet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /pets/{petId}:
 *   delete:
 *     summary: Elimina una mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/pets/:petId', authUniversal, async (req, res) => {
    try {
        const result = await petService.deletePet(req.params.petId, req.user._id);
        res.json(result);
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
 *         _id:
 *           type: string
 *           description: ID de la mascota
 *         name:
 *           type: string
 *           description: Nombre de la mascota
 *         type:
 *           type: string
 *           description: Tipo de mascota (perro, gato, etc.)
 *         ownerId:
 *           type: string
 *           description: ID del héroe dueño
 *         estado:
 *           type: string
 *           description: Estado de la mascota
 *       example:
 *         _id: "64a1b2c3d4e5f6a7b8c9d0e2"
 *         name: "Krypto"
 *         type: "Perro"
 *         ownerId: "64a1b2c3d4e5f6a7b8c9d0e1"
 *         estado: "normal"
 */

// ===================== ENDPOINTS DE CUIDADO DE MASCOTAS =====================

/**
 * @swagger
 * /mascotas/{id}/alimentar:
 *   post:
 *     summary: Alimenta a la mascota con el ID especificado
 *     tags: [CuidadoMascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
router.post('/mascotas/:id/alimentar', authUniversal, async (req, res) => {
    try {
        // Lógica de alimentar (puedes personalizar)
        const pet = await petService.alimentarPet(req.params.id, req.user._id);
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
 *     tags: [CuidadoMascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
router.post('/mascotas/:id/banar', authUniversal, async (req, res) => {
    try {
        const pet = await petService.banarPet(req.params.id, req.user._id);
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
 *     tags: [CuidadoMascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
router.post('/mascotas/:id/pasear', authUniversal, async (req, res) => {
    try {
        const pet = await petService.pasearPet(req.params.id, req.user._id);
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
 *     tags: [CuidadoMascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
router.post('/mascotas/:id/jugar', authUniversal, async (req, res) => {
    try {
        const pet = await petService.jugarPet(req.params.id, req.user._id);
        res.json({ mensaje: 'Mascota jugada con éxito', estado: pet.estado });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /mascotas/{id}/curar:
 *   post:
 *     summary: Cura a la mascota con el ID especificado
 *     tags: [CuidadoMascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota curada con éxito
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
router.post('/mascotas/:id/curar', authUniversal, async (req, res) => {
    try {
        const pet = await petService.curarPet(req.params.id, req.user._id);
        res.json({ mensaje: 'Mascota curada con éxito', estado: pet.estado });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /mascotas/{id}/estado:
 *   get:
 *     summary: Obtiene el estado actual de la mascota con el ID especificado
 *     tags: [CuidadoMascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
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
 *                 descripcion:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/mascotas/:id/estado', authUniversal, async (req, res) => {
    try {
        const estado = await petService.getEstadoPet(req.params.id, req.user._id);
        res.json(estado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router; 