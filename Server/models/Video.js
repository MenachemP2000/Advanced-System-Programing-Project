const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  usersLikes: { type: [String], default: [] }
});

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  usersLikes: { type: [String], default: [] },
  replies: { type: [replySchema], default: [] }
});

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  source: { type: String, required: true },
  thumbnail: { type: String, required: true },
  tags: { type: [String], default: [] },
  upload_date: { type: Date, required: true },
  duration: { type: String, required: true },
  username: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  usersLikes: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] }
});

module.exports = mongoose.model('Video', videoSchema);
