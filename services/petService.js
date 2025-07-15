import petRepository from '../repositorios/petRepository.js';
import Pet from '../models/petModel.js';

async function getAllPets() {
    return await petRepository.getPets();
}

async function addPet(pet) {
    if (!pet.name || !pet.type) {
        throw new Error("La mascota debe tener nombre y tipo.");
    }
    return await petRepository.savePet({ ...pet, estado: 'normal' });
}

async function updatePet(id, updatedPet) {
    const pet = await Pet.findByIdAndUpdate(id, updatedPet, { new: true });
    if (!pet) {
        throw new Error('Mascota no encontrada');
    }
    return pet;
}

async function deletePet(id) {
    const result = await Pet.findByIdAndDelete(id);
    if (!result) {
        throw new Error('Mascota no encontrada');
    }
    return { message: 'Mascota eliminada' };
}

async function assignOwner(petId, ownerId) {
    const pet = await Pet.findByIdAndUpdate(petId, { ownerId }, { new: true });
    if (!pet) {
        throw new Error('Mascota no encontrada');
    }
    return pet;
}

// --- NUEVAS FUNCIONES DE CUIDADO ---
async function alimentarPet(id) {
    const pet = await Pet.findById(id);
    if (!pet) throw new Error('Mascota no encontrada');
    if (pet.estado === 'enferma' || pet.estado === 'deprimida') {
        // No cambia el estado
    } else if (pet.estado === 'hambriento') {
        pet.estado = 'normal';
    } else {
        pet.estado = 'alimentada';
    }
    await pet.save();
    return pet;
}

async function banarPet(id) {
    const pet = await Pet.findById(id);
    if (!pet) throw new Error('Mascota no encontrada');
    if (pet.estado === 'enferma') {
        // No cambia el estado
    } else {
        pet.estado = 'bañada';
    }
    await pet.save();
    return pet;
}

async function pasearPet(id) {
    const pet = await Pet.findById(id);
    if (!pet) throw new Error('Mascota no encontrada');
    if (pet.estado === 'enferma') {
        // No cambia el estado
    } else {
        pet.estado = 'feliz';
    }
    await pet.save();
    return pet;
}

async function jugarPet(id) {
    const pet = await Pet.findById(id);
    if (!pet) throw new Error('Mascota no encontrada');
    if (pet.estado === 'enferma') {
        // No cambia el estado
    } else {
        pet.estado = 'feliz';
    }
    await pet.save();
    return pet;
}

async function curarPet(id) {
    const pet = await Pet.findById(id);
    if (!pet) throw new Error('Mascota no encontrada');
    if (pet.estado === 'enferma') {
        pet.estado = 'normal';
    }
    await pet.save();
    return pet;
}

function cambiarEstadoAleatorio(pet) {
    if (pet.estado === 'normal') {
        const estados = ['normal', 'enferma', 'deprimida', 'feliz', 'hambriento', 'aburrido'];
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
        if (Math.random() < 0.5) {
            pet.estado = 'normal';
        }
    }
    return pet;
}

async function getEstadoPet(id) {
    const pet = await Pet.findById(id);
    if (!pet) throw new Error('Mascota no encontrada');
    let petMod = cambiarEstadoAleatorio(pet);
    const estadosValidos = ['normal', 'enferma', 'deprimida', 'feliz', 'hambriento', 'aburrido'];
    if (!estadosValidos.includes(petMod.estado)) {
        petMod.estado = 'normal';
    }
    await petMod.save();
    let descripcion = '';
    switch (petMod.estado) {
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
    return { estado: petMod.estado, descripcion };
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