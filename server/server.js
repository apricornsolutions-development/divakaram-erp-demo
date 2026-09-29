require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
const deviceRoutes = require('./routes/deviceRoutes');
const repairRoutes = require('./routes/repairRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/devices', deviceRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Divakaram ERP API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));