import petRepository from '../repositorios/petRepository.js';
import Pet from '../models/petModel.js';

async function getAllPets() {
    return await petRepository.getPets();
}

async function addPet(pet) {
    if (!pet.name || !pet.type) {
        throw new Error("La mascota debe tener nombre y tipo.");
    }
    const pets = await petRepository.getPets();
    const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    const newPet = { ...pet, id: newId };
    pets.push(newPet);
    await petRepository.savePets(pets);
    return newPet;
}

async function updatePet(id, updatedPet) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    delete updatedPet.id;
    pets[index] = { ...pets[index], ...updatedPet };
    await petRepository.savePets(pets);
    return pets[index];
}

async function deletePet(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const filteredPets = pets.filter(pet => pet.id !== parseInt(id));
    await petRepository.savePets(filteredPets);
    return { message: 'Mascota eliminada' };
}

async function assignOwner(petId, ownerId) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(petId));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    pets[index].ownerId = ownerId;
    await petRepository.savePets(pets);
    return pets[index];
}

export default {
    getAllPets,
    addPet,
    updatePet,
    deletePet,
    assignOwner
}; 