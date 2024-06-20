const Video = require('../models/Video');
const mongoose = require('mongoose');


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
    const { title, username, uploadDate } = req.query;

    // Initialize an array to hold individual query conditions
    let queryConditions = [];

    if (title) {
      queryConditions.push({ title: { $regex: title, $options: 'i' } }); // Case-insensitive regex search
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

exports.getRelatedVideos = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const { _id, username, tags } = video;

    // Fetch videos from the database based on the query
    let pipeline = [
      {
        $match: {
          _id: { $ne: _id }
        }
      },
      {
        $addFields: {
          priorityScore: {
            $add: [
              { $multiply: [{ $size: { $setIntersection: [tags, '$tags'] } }, 1] }, // Score for common tags
              { $cond: { if: { $eq: ['$username', username] }, then: 5, else: 0 } }   // Score for matching username
            ]
          }
        }
      },
      {
        $sort: { priorityScore: -1, _id: 1 }
      }

    ];

    const page = parseInt(req.query.page) || 1; // Get the page from the query or default to 1
    const limit = parseInt(req.query.limit);
    if (limit) {
      const skip = (page - 1) * limit;
      pipeline = [
        ...pipeline,
        { $skip: skip },
        { $limit: limit },
        { $sample: { size: limit }}
      ];
    }

    const videos = await Video.aggregate(pipeline);
    const totalVideos = await Video.countDocuments();

    res.json({
      videos: videos,
      totalVideos: totalVideos,
      currentPage: page,
      totalPages: Math.ceil(totalVideos / limit)
    });

  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};


exports.getRelatedVideosWithoutCurrentOnes = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const { _id, username, tags } = video;
    const relatedVideosIds = req.body;
    const objectIdArray = relatedVideosIds
      .filter(id => {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
          console.error(`Invalid ObjectID: ${id}`);
        }
        return isValid;
      })
      .map(id => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch (err) {
          console.error(`Error converting to ObjectID: ${id}`, err);
          return null;
        }
      })
      .filter(id => id !== null);
    // Fetch videos from the database based on the query
    const pipeline = [
      {
        $match: {
          _id: { $nin: objectIdArray },
          $or: [
            { username: username },
            { tags: { $in: tags } }
          ]
        }
      },
      {
        $addFields: {
          commonTags: {
            $size: {
              $setIntersection: [tags, '$tags']
            }
          }
        }
      },
      {
        $sort: { commonTags: -1 } // Sort by most common tags descending
      },
      { $limit: 10 },
      { $sample: { size: 10 } }
    ];

    const videos = await Video.aggregate(pipeline);
    if (videos.length < 1) {
      const pipelineFallback = [
        {
          $match: {
            _id: { $nin: objectIdArray }
          }
        },
        { $sample: { size: 10 } } // Sample 10 random documents
      ];
      const fallBackVideos = await Video.aggregate(pipelineFallback);
      await res.send(fallBackVideos);
    }
    else {
      await res.send(videos);
    }
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
