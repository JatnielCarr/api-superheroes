import mongoose from 'mongoose';
import 'dotenv/config';

const uri = process.env.MONGODB_URI || 'mongodb+srv://jatnielcarr10:J4flores24@cluster0.fu2p8ok.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

await mongoose.connect(uri);

const heroes = await mongoose.connection.db.collection('heroes').find().toArray();
const pets = await mongoose.connection.db.collection('pets').find().toArray();

console.log('Héroes (colección heroes):');
heroes.forEach(h => console.log(`  alias: ${h.alias}, _id: ${h._id}`));
console.log('Mascotas (colección pets):');
pets.forEach(p => console.log(`  name: ${p.name}, ownerId: ${p.ownerId}`));

process.exit(0);