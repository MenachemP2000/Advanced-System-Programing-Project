const Video = require('../models/Video');

// Create a comment
exports.createComment = async (req, res) => {
  const { videoId } = req.params;
  const { user, content, date,usersLikes,replies } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Video not found');
    }

    const newComment = {
      user,
      content,
      date,
      usersLikes,
      replies,
    };

    video.comments.push(newComment);
    await video.save();

    res.status(201).send(video.comments[video.comments.length - 1]);
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

// Update a comment (PUT)
exports.updateComment = async (req, res) => {
  const { videoId, commentId } = req.params;
  const updatedComment = req.body;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Video not found');
    }

    const comment = video.comments.id(commentId);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    
    comment.user = updatedComment.user || comment.user; // retain the old value if the new value is not provided
    comment.content = updatedComment.content || comment.content;
    comment.date = updatedComment.date || comment.date;
    comment.usersLikes = updatedComment.usersLikes || comment.usersLikes;
    comment.replies = updatedComment.replies || comment.replies;

    await video.save();

    res.send(comment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


// Update a comment (PATCH)
exports.partialUpdateComment = async (req, res) => {
  const { videoId, commentId } = req.params;
  const updatedFields = req.body;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).send('Video not found');
    }

    const comment = video.comments.id(commentId);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    // Update only the provided fields
    Object.keys(updatedFields).forEach(field => {
      comment[field] = updatedFields[field];
    });

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
    
    const comment = video.comments.id(commentId);

    video.comments.remove(comment);
    await video.save();

    res.send('Comment deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
