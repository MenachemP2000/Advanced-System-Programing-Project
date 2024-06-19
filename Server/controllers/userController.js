const User = require('../models/User');
const Video = require('../models/Video');
const path = require('path');
const fs = require('fs');

exports.createUser = async (req, res) => {
    const { username, displayname, password, passwordAgain, image } = req.body;
    try {

        // Basic validation
        if (!username || !displayname || !password || !passwordAgain || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const displaynameWords = displayname.trim().split(/\s+/);
        if (displaynameWords.length < 2) {
            return res.status(400).json({ message: 'Must input first and last name' });
        }

        if (password !== passwordAgain) {
            return res.status(400).json({ message: 'Password fields do not match' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (!hasLetter || !hasNumber) {
            return res.status(400).json({ message: 'Password must contain both letters and numbers' });
        }

        // Check if the username is already taken
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Save base64 image to server
        const base64Image = image.split(';base64,').pop();
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const imageName =`${Date.now()}-${username}.jpg`
        const imagePath = path.join(__dirname, '..', 'build', 'pictures', 'users', imageName);

        fs.writeFileSync(imagePath, imageBuffer);

        // Create and save the new user
        const newUser = new User({
            username, displayname, password,
            image: `/pictures/users/${imageName}`,
        });

        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({ message: 'An error occurred', error });
    }
};


// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get user by id
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};
// Get user by name
exports.getUserByUserName = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};





// Update a user (PUT)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Update a user
exports.partialUpdateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a user videos by ID
exports.getUserVideos = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        const username = user.username;
        const videos = await Video.find({ username: username });
        if (!videos) {
            return res.status(404).send('No videos found for this user');
        }
        res.send(videos);
    } catch (error) {
        res.status(500).send('Error fetching user videos: ' + error.message);
    }
};