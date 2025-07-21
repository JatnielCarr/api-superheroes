import jwt from 'jsonwebtoken';
import Pet from '../models/petModel.js';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware para endpoints de cuidado de mascotas
export default async function heroAuth(req, res, next) {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Token requerido' });
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'hero') {
            return res.status(403).json({ message: 'Solo los héroes pueden acceder a este recurso' });
        }
        // Si la ruta tiene :id de mascota, verificar que sea dueño
        const petId = req.params.id;
        if (petId) {
            const pet = await Pet.findById(petId);
            if (!pet) return res.status(404).json({ message: 'Mascota no encontrada' });
            if (String(pet.ownerId) !== String(decoded.id)) {
                return res.status(403).json({ message: 'Solo puedes acceder a tu propia mascota' });
            }
        }
        req.hero = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
} 