
const express = require('express');
const router = express.Router();
const Video = require('../models/Video');



// Create a new video
router.post('/videos', async (req, res) => {
  try {
    const newVideo = new Video(req.body);
    await newVideo.save();
    res.status(201).send(newVideo);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.send(videos);
  } catch (error) {
    res.status(500).send(error);
  }
});


// need to Get 20 certain videos !to modify!
router.get('', async (req, res) => {
  try {
    const videos = await Video.find();
    res.send(videos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).send();
    }
    res.send(video);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a video (PUT)
router.put('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!video) {
      return res.status(404).send();
    }
    res.send(video);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a video
router.patch('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!video) {
      return res.status(404).send();
    }
    res.send(video);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a video
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).send();
    }
    res.send(video);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
