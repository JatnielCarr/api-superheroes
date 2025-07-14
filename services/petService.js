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
    const newPet = { ...pet, id: newId, estado: 'normal' };
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

// --- NUEVAS FUNCIONES DE CUIDADO ---
async function alimentarPet(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    // Si está enferma o deprimida, alimentarla no cambia el estado
    if (pets[index].estado === 'enferma' || pets[index].estado === 'deprimida') {
        // No cambia el estado
    } else if (pets[index].estado === 'hambriento') {
        pets[index].estado = 'normal';
    } else {
        pets[index].estado = 'alimentada';
    }
    await petRepository.savePets(pets);
    return pets[index];
}

async function banarPet(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    // Si está enferma, bañarla no cambia el estado
    if (pets[index].estado === 'enferma') {
        // No cambia el estado
    } else {
        pets[index].estado = 'bañada';
    }
    await petRepository.savePets(pets);
    return pets[index];
}

async function pasearPet(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    // Si está enferma, pasear no cambia el estado
    if (pets[index].estado === 'enferma') {
        // No cambia el estado
    } else {
        pets[index].estado = 'feliz';
    }
    await petRepository.savePets(pets);
    return pets[index];
}

async function jugarPet(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    // Si está enferma, jugar no cambia el estado
    if (pets[index].estado === 'enferma') {
        // No cambia el estado
    } else {
        pets[index].estado = 'feliz';
    }
    await petRepository.savePets(pets);
    return pets[index];
}

async function curarPet(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    // Solo puede curarse si está enferma
    if (pets[index].estado === 'enferma') {
        pets[index].estado = 'normal';
    }
    await petRepository.savePets(pets);
    return pets[index];
}

// Lógica para cambiar el estado aleatoriamente
function cambiarEstadoAleatorio(pet) {
    // Solo cambiar si está en estado normal
    if (pet.estado === 'normal') {
        const estados = ['normal', 'enferma', 'deprimida', 'feliz', 'hambriento', 'aburrido'];
        // Probabilidad: 35% normal, 25% enferma, 10% deprimida, 8% feliz, 12% hambriento, 10% aburrido
        const rand = Math.random();
        if (rand < 0.25) {
            pet.estado = 'enferma';
        } else if (rand < 0.35) {
            pet.estado = 'deprimida';
        } else if (rand < 0.43) {
            pet.estado = 'feliz';
        } else if (rand < 0.55) {
            pet.estado = 'hambriento';
        } else if (rand < 0.65) {
            pet.estado = 'aburrido';
        } else {
            pet.estado = 'normal';
        }
    } else if (pet.estado === 'feliz') {
        // Si está feliz, después de consultar puede volver a normal
        if (Math.random() < 0.5) {
            pet.estado = 'normal';
        }
    }
    return pet;
}

async function getEstadoPet(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    // Cambiar estado aleatoriamente al consultar
    let pet = cambiarEstadoAleatorio(pets[index]);
    // Validar estado
    const estadosValidos = ['normal', 'enferma', 'deprimida', 'feliz', 'hambriento', 'aburrido'];
    if (!estadosValidos.includes(pet.estado)) {
        pet.estado = 'normal';
    }
    await petRepository.savePets(pets);
    // Mensaje descriptivo según el estado
    let descripcion = '';
    switch (pet.estado) {
        case 'normal':
            descripcion = 'La mascota está tranquila.';
            break;
        case 'enferma':
            descripcion = 'La mascota está enferma.';
            break;
        case 'deprimida':
            descripcion = 'La mascota está deprimida.';
            break;
        case 'feliz':
            descripcion = '¡La mascota está feliz!';
            break;
        case 'hambriento':
            descripcion = 'La mascota tiene hambre.';
            break;
        case 'aburrido':
            descripcion = 'La mascota está aburrida.';
            break;
    }
    return { estado: pet.estado, descripcion };
}

export default {
    getAllPets,
    addPet,
    updatePet,
    deletePet,
    assignOwner,
    alimentarPet,
    banarPet,
    pasearPet,
    jugarPet,
    getEstadoPet,
    curarPet
}; 