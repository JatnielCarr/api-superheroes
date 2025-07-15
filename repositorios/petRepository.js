import Pet from '../models/petModel.js';
import fs from 'fs-extra';

const filePath = './pets.json';

// Obtener todas las mascotas desde MongoDB
async function getPets() {
    try {
        return await Pet.find();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Guardar una mascota en MongoDB
async function savePet(petData) {
    try {
        const pet = new Pet(petData);
        return await pet.save();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Guardar todas las mascotas en archivo .json (opcional)
async function savePetsToFile(pets) {
    try {
        await fs.writeJson(filePath, pets);
    } catch (error) {
        console.error(error);
    }
}

export default {
    getPets,
    savePet,
    savePetsToFile
}; 