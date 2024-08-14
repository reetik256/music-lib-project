const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

exports.getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user.id }).populate('songs');
        res.json(playlists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');

        if (!playlist || playlist.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.createPlaylist = async (req, res) => {
    const { name, songs } = req.body;

    try {
        const playlist = new Playlist({
            name,
            user: req.user.id,
            songs
        });

        await playlist.save();
        res.status(201).json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Update a Playlist:

// Method: PUT
// URL: http://localhost:5000/api/playlists/{id}
// Headers:
// Authorization: Bearer <your_jwt_token>
// Body (JSON):
// {
//   "name": "Updated Playlist Name",
//   "songs": ["song_id_3", "song_id_4"]
// }

exports.updatePlaylist = async (req, res) => {
    const { name, songs } = req.body;

    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist || playlist.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        playlist.name = name || playlist.name;
        playlist.songs = songs || playlist.songs;

        await playlist.save();
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Delete a Playlist:

// Method: DELETE
// URL: http://localhost:5000/api/playlists/{id}
// Headers:
// Authorization: Bearer <your_jwt_token>

exports.deletePlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        if (playlist.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Use deleteOne() to remove the document
        await Playlist.deleteOne({ _id: playlistId });

        res.json({ message: 'Playlist removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Add a Song to Playlist:

// Method: POST
// URL: http://localhost:5000/api/playlists/{id}/songs
// Headers:
// Authorization: Bearer <your_jwt_token>
// Copy code
// {
//   "songId": "song_id_1"
// }

exports.addSongToPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist || playlist.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const song = await Song.findById(req.body.songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        playlist.songs.push(song);
        await playlist.save();

        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Remove a Song from Playlist:

// Method: DELETE
// URL: http://localhost:5000/api/playlists/{id}/songs
// Headers:
// Authorization: Bearer <your_jwt_token>
// Body (JSON):
// {
//   "songId": "song_id_1"
// }

exports.removeSongFromPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist || playlist.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        playlist.songs = playlist.songs.filter(song => song.toString() !== req.body.songId);

        await playlist.save();
        res.json(playlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};









