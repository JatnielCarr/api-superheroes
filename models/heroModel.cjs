const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    name: { type: String, required: true },
    alias: { type: String, required: true },
    city: { type: String, required: true },
    team: { type: String, required: true }
});

const Hero = mongoose.model('Hero', heroSchema);

module.exports = Hero;
