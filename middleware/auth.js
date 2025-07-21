import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado. Debes enviar el header Authorization: Bearer <token>' });
  }
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Formato de token inválido. Usa Authorization: Bearer <token>' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: 'Usuario no encontrado para el token proporcionado.' });
    }
    req.user = admin;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Por favor, inicia sesión nuevamente.' });
    }
    res.status(401).json({ error: 'Token inválido. Verifica que el token sea correcto y no esté alterado.' });
  }
} 