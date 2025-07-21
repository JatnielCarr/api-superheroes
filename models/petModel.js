import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero', default: null },
    estado: { type: String, default: 'normal' }
});

const Pet = mongoose.model('Pet', petSchema, 'pets');

export default Pet; 