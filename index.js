const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/songs', require('./routes/songRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));