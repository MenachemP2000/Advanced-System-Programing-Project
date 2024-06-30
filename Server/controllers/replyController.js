const Video = require('../models/Video');
const jwt = require("jsonwebtoken")
const key = "Some super secret key"

// Create a reply
exports.createReply = async (req, res) => {
    const { videoId, commentId } = req.params;
    const { user, content, date, usersLikes } = req.body;
    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).send('Video not found');
        }

        const comment = video.comments.id(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }
        const newReply = {
            user,
            content,
            date,
            usersLikes,
        };

        video.comments.comment.push(newReply);
        await video.save();

        res.status(201).send(newReply);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get all replies for a comment
exports.getReplies = async (req, res) => {
    const { videoId, commentId } = req.params;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).send('Video not found');
        }

        const comment = video.comments.id(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        res.send(comment.replies);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Get a reply for a comment
exports.getReply = async (req, res) => {
    const { videoId, commentId, replyId } = req.params;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).send('Video not found');
        }

        const comment = video.comments.id(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return res.status(404).send('Reply not found');
        }
        res.send(reply);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Update a reply
exports.updateReply = async (req, res) => {
    const { videoId, commentId, replyId } = req.params;
    const { content } = req.body;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).send('Video not found');
        }

        const comment = video.comments.id(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return res.status(404).send('Reply not found');
        }

        reply.content = content;
        await video.save();
        res.send(reply);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Delete a reply
exports.deleteReply = async (req, res) => {
    const { videoId, commentId, replyId } = req.params;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).send('Video not found');
        }

        const comment = video.comments.id(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        comment.replies.id(replyId).remove();
        await video.save();

        res.send('Reply deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
