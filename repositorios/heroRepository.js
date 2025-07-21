import Hero from '../models/heroModel.js';

class HeroRepository {
    async getHeroes(filter = {}) {
        try {
            return await Hero.find(filter).populate('pets');
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getHeroById(id) {
        try {
            if (id.length === 8) {
                const all = await Hero.find().populate('pets');
                return all.find(h => h._id.toString().substring(0,8) === id);
            } else {
                return await Hero.findById(id).populate('pets');
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async saveHero(heroData) {
        try {
            if (heroData._id) {
                return await Hero.findByIdAndUpdate(heroData._id, heroData, { new: true });
            } else {
                const hero = new Hero(heroData);
                return await hero.save();
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default HeroRepository;
