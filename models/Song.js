const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    musicDirector: { type: String },
    releaseDate: { type: Date },
    isVisible: { type: Boolean, default: true }
});

module.exports = mongoose.model('Song', SongSchema);