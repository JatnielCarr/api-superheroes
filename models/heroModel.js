import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    alias: { type: String, required: true },
    city: { type: String },
    team: { type: String },
    password: { type: String }, // Nuevo campo para autenticación
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero', required: true } // Campo para asociar el dueño
});

export default mongoose.model('Hero', heroSchema); 