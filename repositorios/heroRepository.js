import Hero from '../models/heroModel.js';
import fs from 'fs-extra';

const filePath = './superheroes.json';

// Obtener todos los héroes desde MongoDB
async function getHeroes() {
    try {
        return await Hero.find();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Guardar un héroe en MongoDB
async function saveHero(heroData) {
    try {
        const hero = new Hero(heroData);
        return await hero.save();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Guardar todos los héroes en archivo .json (opcional)
async function saveHeroesToFile(heroes) {
    try {
        await fs.writeJson(filePath, heroes);
    } catch (error) {
        console.error(error);
    }
}

export default {
    getHeroes,
    saveHero,
    saveHeroesToFile
};
