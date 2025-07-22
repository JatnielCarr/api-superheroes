import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function migrarHeros() {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const heros = await db.collection('heros').find({}).toArray();
    if (heros.length === 0) {
        console.log('No hay documentos en la colección heros.');
        process.exit(0);
    }
    // Elimina el _id para evitar duplicados
    const docs = heros.map(h => { const {_id, ...rest} = h; return rest; });
    await db.collection('heroes').insertMany(docs);
    console.log(`Migrados ${docs.length} documentos de 'heros' a 'heroes'.`);
    process.exit(0);
}

migrarHeros(); 