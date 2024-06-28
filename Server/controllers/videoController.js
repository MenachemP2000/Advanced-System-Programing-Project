const Video = require('../models/Video');
const jwt = require("jsonwebtoken")
const key = "Some super secret key"
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

exports.getVideos = async (req, res) => {
  try {
    // Fetch top 10 videos by views
    const topVideos = await Video.find().sort({ views: -1, _id: 1  }).limit(10);
    const topVideoIds = topVideos.map(video => video._id);

    // Fetch 10 random videos excluding the top 10
    const randomVideos = await Video.aggregate([
      { $match: { _id: { $nin: topVideoIds } } },
      { $sample: { size: 10 } }
    ]);

    // Combine both results
    const videos = [...topVideos, ...randomVideos];

    // Send the combined results
    res.send(videos);
  } catch (error) {

    console.error('Error fetching videos:', error);
    res.status(500).send(error);
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
        { $sample: { size: limit } }
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


    const test = await Video.findById(req.params.id);
    if (!test) {
      return res.status(404).send();
    }
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      return res.status(403).send('Forbidden');
    }

    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.send(video);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a video by ID (PATCH)
exports.partialUpdateVideo = async (req, res) => {
  try {
    const test = await Video.findById(req.params.id);
    if (!test) {
      return res.status(404).send();
    }
    if (req.headers.authorization) {
      // Extract the token from that header
      try {
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, key);
        if (data.username !== test.username) {
          if ('title' in req.body || 'description' in req.body || 'source' in req.body ||
            'thumbnail' in req.body || 'tags' in req.body || 'upload_date' in req.body ||
            'duration' in req.body || 'username' in req.body) {
            return res.status(403).send('Forbidden');
          }

          if ('views' in req.body) {
            if (req.body.views !== test.views + 1 && req.body.views !== test.views) {
              return res.status(403).send('Forbidden');
            }
          }
          if ('likeCount' in req.body) {
            if (req.body.likeCount !== test.likeCount + 1 && req.body.likeCount !== test.likeCount - 1) {
              return res.status(403).send('Forbidden');
            }
          }

          if ('usersLikes' in req.body) {
            if (req.body.usersLikes.length !== test.usersLikes.length + 1 && req.body.usersLikes.length !== test.usersLikes.length - 1) {
              return res.status(403).send('Forbidden');
            }
          }
          if ('comments' in req.body) {
            if (req.body.comments.length !== test.comments.length + 1 && req.body.comments.length !== test.comments.length - 1) {
              return res.status(403).send('Forbidden');
            }
          }
        }
        const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.send(video);
      }
      catch (err) {
        if ('title' in req.body || 'description' in req.body || 'source' in req.body ||
          'thumbnail' in req.body || 'tags' in req.body || 'upload_date' in req.body ||
          'duration' in req.body || 'username' in req.body || 'likeCount' in req.body ||
          'usersLikes' in req.body || 'comments' in req.body) {
          return res.status(403).send('Forbidden');
        }
        else if ('views' in req.body) {
          if (req.body.views !== test.views + 1 && req.body.views !== test.views) {
            return res.status(403).send('Forbidden');
          }
          try {
            const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            res.send(video);
          }
          catch (error) {
            res.status(400).send(error);
          }
        }
      }
    }
    else
      return res.status(403).send('Token required');
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a video by ID
exports.deleteVideo = async (req, res) => {
  try {


    const test = await Video.findById(req.params.id);
    if (!test) {
      return res.status(404).send();
    }
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      return res.status(403).send('Forbidden');
    }

    const video = await Video.findByIdAndDelete(req.params.id);

    res.send(video);
  } catch (error) {
    res.status(500).send(error);
  }
};
