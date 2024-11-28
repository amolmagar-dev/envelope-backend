const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');
const accountRoutes = require('./routes/accountRoutes');

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();

app.use(express.json()); // Middleware to parse JSON requests

// Routes
app.use('/api/users', userRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/accounts', accountRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;