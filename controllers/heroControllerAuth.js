import Hero from '../models/heroModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

/**
 * @swagger
 * /login-hero:
 *   post:
 *     summary: Autenticación de superhéroe y obtención de token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *                 example: "Chapulín Colorado"
 *               password:
 *                 type: string
 *                 example: "claveSuperHeroe"
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
 *       401:
 *         description: Credenciales inválidas
 */
export const loginHero = async (req, res) => {
    const { alias, password } = req.body;
    try {
        const hero = await Hero.findOne({ alias });
        if (!hero || !hero.password) return res.status(401).json({ message: 'Credenciales inválidas' });
        const valid = await bcrypt.compare(password, hero.password);
        if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });
        const token = jwt.sign({ id: hero._id, alias: hero.alias, role: 'hero' }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
}; 