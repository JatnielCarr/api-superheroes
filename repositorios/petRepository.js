import fs from 'fs-extra';
import Pet from '../models/petModel.js';

const filePath = './pets.json';

async function getPets() {
    try {
        const data = await fs.readJson(filePath);
        return data.map(pet => new Pet(
            pet.id, 
            pet.name, 
            pet.type, 
            pet.ownerId, 
            pet.estado || 'normal'
        ));
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        console.error(error);
        return [];
    }
}

async function savePets(pets) {
    try {
        // Convertir a objeto plano para guardar todas las propiedades
        const plainPets = pets.map(pet => ({
            id: pet.id,
            name: pet.name,
            type: pet.type,
            ownerId: pet.ownerId,
            estado: pet.estado || 'normal'
        }));
        await fs.writeJson(filePath, plainPets);
    } catch (error) {
        console.error(error);
    }
}

export default {
    getPets,
    savePets
}; 