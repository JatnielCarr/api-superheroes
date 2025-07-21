import mongoose from 'mongoose';
import Hero from './models/heroModel.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function actualizarOwners() {
    await mongoose.connect(MONGO_URI);
    const heroes = await Hero.find();
    for (const hero of heroes) {
        if (!hero.owner) {
            hero.owner = hero._id;
            await hero.save();
            console.log(`Actualizado owner para héroe: ${hero.alias}`);
        }
    }
    console.log('Actualización de owners completada.');
    process.exit(0);
}

actualizarOwners(); 