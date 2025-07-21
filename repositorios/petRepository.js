import Pet from '../models/petModel.js';

class PetRepository {
    async getPets(filter = {}) {
        try {
            return await Pet.find(filter);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getPetById(id) {
        try {
            return await Pet.findById(id);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async savePet(petData) {
        try {
            if (petData._id) {
                return await Pet.findByIdAndUpdate(petData._id, petData, { new: true });
            } else {
                const pet = new Pet(petData);
                return await pet.save();
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default PetRepository; 