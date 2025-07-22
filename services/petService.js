import PetRepository from '../repositorios/petRepository.js';

class PetService {
    constructor() {
        this.petRepository = new PetRepository();
    }

    async getAllPets(user) {
        // Si el usuario es admin, devuelve todas las mascotas
        if (user.role === 'admin' || user.email === 'admin') {
            return await this.petRepository.getPets({});
        }
        // Si no, solo las del usuario autenticado
        return await this.petRepository.getPets({ ownerId: user._id || user.id });
    }

    async addPet(pet) {
        if (!pet.name || !pet.type) {
            throw new Error("La mascota debe tener un nombre y un tipo.");
        }
        return await this.petRepository.savePet(pet);
    }

    async updatePet(id, updatedPet, userId) {
        const pet = await this.petRepository.getPetById(id);
        if (!pet || pet.ownerId.toString() !== userId.toString()) {
            throw { status: 403, message: 'No tienes permiso para modificar esta mascota.' };
        }
        return await this.petRepository.savePet({ ...updatedPet, _id: id, ownerId: userId });
    }

    async deletePet(id, userId) {
        const pet = await this.petRepository.getPetById(id);
        if (!pet || pet.ownerId.toString() !== userId.toString()) {
            throw { status: 403, message: 'No tienes permiso para eliminar esta mascota.' };
        }
        await pet.deleteOne();
        return { message: 'Mascota eliminada' };
    }

    async alimentarPet(id, userId) {
        const pet = await this.petRepository.getPetById(id);
        if (!pet || pet.ownerId.toString() !== userId.toString()) throw new Error('No tienes permiso para alimentar esta mascota.');
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

    async banarPet(id, userId) {
        const pet = await this.petRepository.getPetById(id);
        if (!pet || pet.ownerId.toString() !== userId.toString()) throw new Error('No tienes permiso para bañar esta mascota.');
        if (pet.estado === 'enferma') {
            // No cambia el estado
        } else {
            pet.estado = 'bañada';
        }
        await pet.save();
        return pet;
    }

    async pasearPet(id, userId) {
        const pet = await this.petRepository.getPetById(id);
        if (!pet || pet.ownerId.toString() !== userId.toString()) throw new Error('No tienes permiso para pasear esta mascota.');
        if (pet.estado === 'enferma') {
            // No cambia el estado
        } else {
            pet.estado = 'feliz';
        }
        await pet.save();
        return pet;
    }

    async jugarPet(id, userId) {
        const pet = await this.petRepository.getPetById(id);
        if (!pet || pet.ownerId.toString() !== userId.toString()) throw new Error('No tienes permiso para jugar con esta mascota.');
        if (pet.estado === 'enferma') {
            // No cambia el estado
        } else {
            pet.estado = 'feliz';
        }
        await pet.save();
        return pet;
    }

    async curarPet(id, userId) {
        const pet = await this.petRepository.getPetById(id);
        if (!pet || pet.ownerId.toString() !== userId.toString()) throw new Error('No tienes permiso para curar esta mascota.');
        if (pet.estado === 'enferma') {
            pet.estado = 'normal';
        }
        await pet.save();
        return pet;
    }

    async getEstadoPet(id, userId) {
        const pet = await this.petRepository.getPetById(id);
        if (!pet || pet.ownerId.toString() !== userId.toString()) throw new Error('No tienes permiso para ver el estado de esta mascota.');
        // Simulación de cambio de estado aleatorio
        let petMod = pet;
        if (pet.estado === 'normal') {
            const estados = ['normal', 'enferma', 'deprimida', 'feliz', 'hambriento', 'aburrido'];
            const rand = Math.random();
            if (rand < 0.25) {
                petMod.estado = 'enferma';
            } else if (rand < 0.35) {
                petMod.estado = 'deprimida';
            } else if (rand < 0.43) {
                petMod.estado = 'feliz';
            } else if (rand < 0.55) {
                petMod.estado = 'hambriento';
            } else if (rand < 0.65) {
                petMod.estado = 'aburrido';
            } else {
                petMod.estado = 'normal';
            }
        } else if (pet.estado === 'feliz') {
            if (Math.random() < 0.5) {
                petMod.estado = 'normal';
            }
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
}

export function toBasicPet(pet) {
    if (!pet) return null;
    // Si pet es un documento de Mongoose, conviértelo a objeto plano
    const obj = typeof pet.toObject === 'function' ? pet.toObject() : pet;
    return {
        _id: obj._id,
        name: obj.name,
        type: obj.type,
        estado: obj.estado
    };
}

export default PetService; 