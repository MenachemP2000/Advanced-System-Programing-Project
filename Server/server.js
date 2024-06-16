const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const app = express();
const port = process.env.PORT || 4000;
const mongodbUri = process.env.MONGODB_URI;

// Middleware to increase payload size limit
app.use(express.json({ limit: '1000mb' })); // You can adjust the limit as needed
app.use(express.urlencoded({ limit: '1000mb', extended: true })); // Also increase for URL-encoded payloads


if (!mongodbUri) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

// Middleware
app.use(express.json());

// Allow all origins in CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

