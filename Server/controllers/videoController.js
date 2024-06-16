const Video = require('../models/Video');

// Create a new video
exports.createVideo = async (req, res) => {
  try {
    const newVideo = new Video(req.body);
    await newVideo.save();
    res.status(201).send(newVideo);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.send(videos);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a specific video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).send();
    }
    res.send(video);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a video by ID (PUT)
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!video) {
      return res.status(404).send();
    }
    res.send(video);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a video by ID (PATCH)
exports.partialUpdateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!video) {
      return res.status(404).send();
    }
    res.send(video);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a video by ID
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).send();
    }
    res.send(video);
  } catch (error) {
    res.status(500).send(error);
  }
};
