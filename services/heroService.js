import heroRepository from '../repositorios/heroRepository.js';

async function getAllHeroes() {
    return await heroRepository.getHeroes();
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }
    return await heroRepository.saveHero(hero);
}

async function updateHero(id, updatedHero) {
    const Hero = (await import('../models/heroModel.js')).default;
    const hero = await Hero.findByIdAndUpdate(id, updatedHero, { new: true });
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return hero;
}

async function deleteHero(id) {
    const Hero = (await import('../models/heroModel.js')).default;
    const result = await Hero.findByIdAndDelete(id);
    if (!result) {
        throw new Error('Héroe no encontrado');
    }
    return { message: 'Héroe eliminado' };
}

async function findHeroesByCity(city) {
    const Hero = (await import('../models/heroModel.js')).default;
    return await Hero.find({ city: { $regex: new RegExp(`^${city}$`, 'i') } });
}

async function faceVillain(heroId, villain) {
    const Hero = (await import('../models/heroModel.js')).default;
    const hero = await Hero.findById(heroId);
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return `${hero.alias} enfrenta a ${villain}`;
}

export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain
};
