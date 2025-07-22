import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import Hero from '../models/heroModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default async function authUniversal(req, res, next) {
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
    // Si es admin
    if (decoded.email) {
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(401).json({ error: 'Admin no encontrado para el token proporcionado.' });
      }
      req.user = { ...admin.toObject(), role: 'admin' };
      return next();
    }
    // Si es héroe
    if (decoded.role === 'hero') {
      const hero = await Hero.findById(decoded.id);
      if (!hero) {
        return res.status(401).json({ error: 'Héroe no encontrado para el token proporcionado.' });
      }
      req.user = { ...hero.toObject(), role: 'hero' };
      return next();
    }
    return res.status(401).json({ error: 'Token no válido para admin ni héroe.' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Por favor, inicia sesión nuevamente.' });
    }
    res.status(401).json({ error: 'Token inválido. Verifica que el token sea correcto y no esté alterado.' });
  }
} 