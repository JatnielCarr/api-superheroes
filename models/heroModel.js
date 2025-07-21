import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    alias: { type: String, required: true },
    city: { type: String },
    team: { type: String },
    password: { type: String } // Nuevo campo para autenticación
});

export default mongoose.model('Hero', heroSchema, 'heros'); 