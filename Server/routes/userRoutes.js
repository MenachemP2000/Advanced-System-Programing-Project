const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const videoRoutes = require('./videoRoutes')


// Create a new user
router.post('', userController.createUser);

// Get all users
router.get('', userController.getAllUsers);

// Get a user by ID
router.get('/:id', userController.getUser);

// Update a user (PUT)
router.put('/:id', userController.updateUser);

// Update a user
router.patch('/:id', userController.partialUpdateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

// Get a user videos by ID
router.get('/:id/videos', userController.getUserVideos);

router.use('/:id/videos', videoRoutes);

module.exports = router;
