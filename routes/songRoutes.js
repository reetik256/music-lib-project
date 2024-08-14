const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, songController.getAllSongs);
router.get('/:id', authMiddleware, songController.getSongById);
router.post('/', authMiddleware, roleMiddleware('admin'), songController.createSong);
router.put('/:id', authMiddleware, roleMiddleware('admin'), songController.updateSong);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), songController.deleteSong);

module.exports = router;
