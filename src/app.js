/**
 * src/app.js
 * Central hub for the Library Management System API
 */

// Load environment variables (DATABASE_URL, etc.) from .env
require('dotenv').config();

const express = require('express');

// Import Middleware
const errorHandler = require('./middleware/errorHandler');

// Import Route Modules
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const trxRoutes = require('./routes/trxRoutes');

const app = express();

/**
 * Global Middleware
 */
// Parse incoming JSON request bodies
app.use(express.json());

/**
 * API Routes
 * These endpoints fulfill the core requirements of the project.
 */

// Handles Book CRUD and GET /books/available
app.use('/books', bookRoutes);

// Handles Member CRUD and GET /members/{id}/borrowed
app.use('/members', memberRoutes);

// Handles borrowing, returning, overdue reports, and fine payments
app.use('/transactions', trxRoutes);

/**
 * Health Check Endpoint (Optional but recommended)
 */
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

/**
 * Error Handling Middleware
 * IMPORTANT: This must be the last middleware registered.
 * It catches all errors thrown in services and controllers.
 */
app.use(errorHandler);

/**
 * Server Start
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`🚀 Library API is running on port: ${PORT}`);
    console.log(`📂 DB Provider: PostgreSQL (via Prisma)`);
    console.log(`✅ Ready for borrowing and fine management`);
    console.log('==============================================');
});

module.exports = app;