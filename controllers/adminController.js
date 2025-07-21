import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

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
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin1234
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
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: 'Credenciales inválidas' });
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });
        const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

/**
 * @swagger
 * /verify:
 *   get:
 *     summary: Verifica si el token JWT de admin es válido
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 autorizado:
 *                   type: boolean
 *                 admin:
 *                   type: object
 *       401:
 *         description: Token inválido o expirado
 */
const verify = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token requerido' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ autorizado: true, admin: decoded });
    } catch (err) {
        res.status(401).json({ autorizado: false, message: 'Token inválido o expirado' });
    }
};

export default {
    login,
    verify
}; 