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

module.exports = mongoose.model('Comment', commentSchema);
