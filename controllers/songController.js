const Song = require('../models/Song');


// Song Management
// Get All Songs (Visible to User):

// Method: GET
// URL: http://localhost:5000/api/songs
// Headers:
// Authorization: Bearer <your_jwt_token>

exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find({ isVisible: true });
        res.json(songs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get Song by ID:

// Method: GET
// URL: http://localhost:5000/api/songs/{id}
// Headers:
// Authorization: Bearer <your_jwt_token>






exports.getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song.isVisible && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(song);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Songs not found');
    }
};


// Create a Song (Admin only):

// Method: POST
// URL: http://localhost:5000/api/songs
// Headers:
// Authorization: Bearer <your_jwt_token>
// Body (JSON):
// {
//   "name": "Song Name",
//   "artist": "Artist Name",
//   "album": "Album Name",
//   "musicDirector": "Director Name",
//   "releaseDate": "2024-01-01",
//   "isVisible": true
// }

exports.createSong = async (req, res) => {
    const { name, artist, album, musicDirector, releaseDate, isVisible } = req.body;

    try {
        const song = new Song({ name, artist, album, musicDirector, releaseDate, isVisible });

        await song.save();
        res.status(201).json(song);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateSong = async (req, res) => {
    const { name, artist, album, musicDirector, releaseDate, isVisible } = req.body;

    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        song.name = name || song.name;
        song.artist = artist || song.artist;
        song.album = album || song.album;
        song.musicDirector = musicDirector || song.musicDirector;
        song.releaseDate = releaseDate || song.releaseDate;
        song.isVisible = isVisible !== undefined ? isVisible : song.isVisible;

        await song.save();
        res.json(song);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.deleteSong = async (req, res) => {
    try {
        const songId = req.params.id;
        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Use deleteOne() instead of song.remove()
        await Song.deleteOne({ _id: songId });

        res.json({ message: 'Song removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};