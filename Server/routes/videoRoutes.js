
const express = require('express');
const router = express.Router();
const commentRoutes = require('./commentRoutes')
const replyRoutes = require('./replyRoutes')
const videoController = require('../controllers/videoController');

// Create a new video
router.post('', videoController.createVideo);

// Get all videos
router.get('', videoController.getAllVideos);

router.get('/:id/related', videoController.getRelatedVideos);

router.post('/:id/related', videoController.getRelatedVideosWithoutCurrentOnes);

// Get a specific video by ID
router.get('/:id', videoController.getVideoById);

// Update a video by ID (PUT)
router.put('/:id', videoController.updateVideo);

// Update a video by ID (PATCH)
router.patch('/:id', videoController.partialUpdateVideo);

// Delete a video by ID
router.delete('/:id', videoController.deleteVideo);

router.use('', commentRoutes);
router.use('', replyRoutes);

module.exports = router;
