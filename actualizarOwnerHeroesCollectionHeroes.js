import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function actualizarOwners() {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const heroes = await db.collection('heroes').find({}).toArray();
    for (const hero of heroes) {
        if (!hero.owner || String(hero.owner) !== String(hero._id)) {
            await db.collection('heroes').updateOne(
                { _id: hero._id },
                { $set: { owner: hero._id } }
            );
            console.log(`Actualizado owner para héroe: ${hero.alias}`);
        }
    }
    console.log('Actualización de owners en colección heroes completada.');
    process.exit(0);
}

actualizarOwners(); 