const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/:videoId/comments', commentController.createComment);

router.get('/:videoId/comments', commentController.getComments);

router.get('/:videoId/comments/:commentId', commentController.getComment);

router.put('/:videoId/comments/:commentId', commentController.updateComment);

router.patch('/:videoId/comments/:commentId', commentController.partialUpdateComment);

router.delete('/:videoId/comments/:commentId', commentController.deleteComment);

module.exports = router;
