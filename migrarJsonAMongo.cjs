require('dotenv').config();
const fs = require('fs-extra');
const connectDB = require('./db.cjs');
const Hero = require('./models/heroModel.cjs');
const Pet = require('./models/petModel.cjs');

async function migrarHeroes() {
    try {
        const heroes = await fs.readJson('./superheroes.json');
        for (const hero of heroes) {
            // Evitar duplicados por nombre y alias
            const existe = await Hero.findOne({ name: hero.name, alias: hero.alias });
            if (!existe) {
                await Hero.create({
                    name: hero.name,
                    alias: hero.alias,
                    city: hero.city,
                    team: hero.team
                });
            }
        }
        console.log('Migración de héroes completada.');
    } catch (error) {
        console.error('Error migrando héroes:', error);
    }
}

async function migrarMascotas() {
    try {
        const pets = await fs.readJson('./pets.json');
        for (const pet of pets) {
            // Validar ownerId: solo asignar si es un ObjectId válido
            let ownerId = null;
            if (pet.ownerId && typeof pet.ownerId === 'string' && pet.ownerId.length === 24) {
                ownerId = pet.ownerId;
            }
            // Evitar duplicados por nombre y tipo
            const existe = await Pet.findOne({ name: pet.name, type: pet.type });
            if (!existe) {
                await Pet.create({
                    name: pet.name,
                    type: pet.type,
                    ownerId: ownerId,
                    estado: pet.estado || 'normal'
                });
            }
        }
        console.log('Migración de mascotas completada.');
    } catch (error) {
        console.error('Error migrando mascotas:', error);
    }
}

async function main() {
    await connectDB();
    await migrarHeroes();
    await migrarMascotas();
    process.exit();
}

main(); 