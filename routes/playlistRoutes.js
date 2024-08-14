const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, playlistController.getPlaylists);
router.get('/:id', authMiddleware, playlistController.getPlaylistById);
router.post('/', authMiddleware, playlistController.createPlaylist);
router.put('/:id', authMiddleware, playlistController.updatePlaylist);
router.delete('/:id', authMiddleware, playlistController.deletePlaylist);
router.post('/:id/songs', authMiddleware, playlistController.addSongToPlaylist);
router.delete('/:id/songs', authMiddleware, playlistController.removeSongFromPlaylist);

module.exports = router;
