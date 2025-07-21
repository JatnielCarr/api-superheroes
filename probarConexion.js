import mongoose from 'mongoose';
import Hero from './models/heroModel.js';
import Pet from './models/petModel.js';

const uri = process.env.MONGODB_URI || 'mongodb+srv://jatnielcarr10:J4flores24@cluster0.fu2p8ok.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

await mongoose.connect(uri);

const heroes = await Hero.find();
const pets = await Pet.find();

console.log('Héroes:', heroes);
console.log('Mascotas:', pets);

process.exit(0);