import mongoose from 'mongoose';
import fs from 'fs-extra';
import Hero from './models/heroModel.js';
import Pet from './models/petModel.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGODB_URI || 'TU_MONGO_URI';

async function migrarSuperheroes() {
    const count = await Hero.countDocuments();
    if (count > 0) {
        console.log('La colección de héroes ya tiene datos. No se migrará superheroes.json');
        return;
    }
    const data = await fs.readJson('./superheroes.json');
    await Hero.insertMany(data);
    console.log('Datos de superheroes.json migrados a MongoDB');
}

async function migrarMascotas() {
    const count = await Pet.countDocuments();
    if (count > 0) {
        console.log('La colección de mascotas ya tiene datos. No se migrará pets.json');
        return;
    }
    const data = await fs.readJson('./pets.json');
    await Pet.insertMany(data);
    console.log('Datos de pets.json migrados a MongoDB');
}

async function main() {
    try {
        await mongoose.connect(MONGO_URI);
        await migrarSuperheroes();
        await migrarMascotas();
        process.exit(0);
    } catch (err) {
        console.error('Error migrando datos:', err);
        process.exit(1);
    }
}

main(); 