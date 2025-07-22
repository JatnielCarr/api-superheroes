import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function actualizarOwnerIdMascotas() {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const heroes = await db.collection('heroes').find({}).toArray();
    const pets = await db.collection('pets').find({}).toArray();
    if (heroes.length === 0 || pets.length === 0) {
        console.log('No hay héroes o mascotas para actualizar.');
        process.exit(0);
    }
    // Asignar ownerId de forma cíclica
    let i = 0;
    for (const pet of pets) {
        const hero = heroes[i % heroes.length];
        await db.collection('pets').updateOne(
            { _id: pet._id },
            { $set: { ownerId: hero._id } }
        );
        console.log(`Mascota ${pet.name} ahora pertenece a ${hero.alias}`);
        i++;
    }
    console.log('Actualización de ownerId en mascotas completada.');
    process.exit(0);
}

actualizarOwnerIdMascotas(); 