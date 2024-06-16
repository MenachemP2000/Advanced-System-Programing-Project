const Video = require('../models/Video');

// Create a comment
exports.createComment = async (req, res) => {
  const { videoId } = req.params;
  const { user, content, date } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Video not found');
    }

    const newComment = {
      user,
      content,
      date,
    };

    video.comments.push(newComment);
    await video.save();

    res.status(201).send(newComment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get all comments for a video
exports.getComments = async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Video not found');
    }

    res.send(video.comments);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get a comment for a video
exports.getComment = async (req, res) => {
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
    res.send(comment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  const { videoId, commentId } = req.params;
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

    comment.content = content;
    await video.save();

    res.send(comment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { videoId, commentId } = req.params;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Video not found');
    }

    video.comments.id(commentId).remove();
    await video.save();

    res.send('Comment deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
