import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/adminModel.js';

const MONGO_URI = process.env.MONGODB_URI || 'TU_MONGO_URI'; // Cambia TU_MONGO_URI si no usas variable de entorno

async function crearAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    const password = await bcrypt.hash('admin1234', 10);
    const existe = await Admin.findOne({ email: 'admin' });
    if (existe) {
      console.log('El usuario admin ya existe');
    } else {
      await Admin.create({ email: 'admin', password });
      console.log('Usuario admin creado correctamente');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error creando el usuario admin:', err);
    process.exit(1);
  }
}

crearAdmin(); 