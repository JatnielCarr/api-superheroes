import mongoose from 'mongoose';
import Pet from './models/petModel.js';
import Hero from './models/heroModel.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function actualizarOwnerMascotas() {
    await mongoose.connect(MONGO_URI);
    const heroes = await Hero.find();
    const heroIds = heroes.map(h => h._id);
    const pets = await Pet.find();
    for (const pet of pets) {
        if (!pet.ownerId && heroIds.length > 0) {
            // Asignar ownerId aleatorio de los héroes existentes
            const randomHeroId = heroIds[Math.floor(Math.random() * heroIds.length)];
            pet.ownerId = randomHeroId;
            await pet.save();
            console.log(`Asignado ownerId a mascota: ${pet.name}`);
        }
    }
    console.log('Actualización de ownerId en mascotas completada.');
    process.exit(0);
}

actualizarOwnerMascotas(); 