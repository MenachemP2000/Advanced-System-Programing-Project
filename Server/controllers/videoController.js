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

exports.getAllVideos = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { title, category, username, uploadDate } = req.query;
    
    // Initialize an array to hold individual query conditions
    let queryConditions = [];
    
    if (title) {
      queryConditions.push({ title: { $regex: title, $options: 'i' } }); // Case-insensitive regex search
    }
    
    if (category) {
      queryConditions.push({ category: category });
    }
    
    if (username) {
      queryConditions.push({ username: username });
    }
    
    if (uploadDate) {
      // Assuming uploadDate is in ISO format (YYYY-MM-DD)
      const startDate = new Date(uploadDate);
      const endDate = new Date(uploadDate);
      endDate.setDate(endDate.getDate() + 1);
      queryConditions.push({ uploadDate: { $gte: startDate, $lt: endDate } });
    }
    
    // Build the final query using $or operator if there are conditions
    let query = queryConditions.length > 0 ? { $or: queryConditions } : {};
    
    // Fetch videos from the database based on the query
    const videos = await Video.find(query);
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
