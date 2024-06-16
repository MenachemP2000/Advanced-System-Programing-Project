const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');

router.post('/:videoId/comments/:commentId/replies', replyController.createReply);

router.get('/:videoId/comments/:commentId/replies', replyController.getReplies);

router.get('/:videoId/comments/:commentId/replies/:replyId', replyController.getReply);

router.patch('/:videoId/comments/:commentId/replies/:replyId', replyController.updateReply);

router.delete('/:videoId/comments/:commentId/replies/:replyId', replyController.deleteReply);

module.exports = router;