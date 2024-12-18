const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Import routes
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config(); // Load environment variables

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1); // Exit the app on connection failure
    });

// Routes
app.use('/api/packages', packageRoutes); // Package-related routes
app.use('/api/bookings', bookingRoutes); // Booking-related routes
app.use('/api/admin', adminRoutes);      // Admin-related routes

// Health Check Route
app.get('/', (req, res) => {
    res.send('Travel Agency API is running smoothly!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
