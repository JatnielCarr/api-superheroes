import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Hero from './models/heroModel.js';

const MONGO_URI = process.env.MONGODB_URI;

const heroes = [
  { alias: 'Batman', password: 'Gotica' },
  { alias: 'Superman', password: 'Metropolis' },
  { alias: 'Chapulin Colorado', password: 'Mexico' }
];

async function asignarPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    for (const hero of heroes) {
      const hash = await bcrypt.hash(hero.password, 10);
      const actualizado = await Hero.findOneAndUpdate(
        { alias: hero.alias },
        { password: hash },
        { new: true }
      );
      if (actualizado) {
        console.log(`Contraseña asignada a ${hero.alias}`);
      } else {
        console.log(`No se encontró el héroe ${hero.alias}`);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error('Error asignando contraseñas:', err);
    process.exit(1);
  }
}

asignarPasswords(); 