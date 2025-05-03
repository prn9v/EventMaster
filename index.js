const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
import initMiddleware from '@/lib/init-middleware';
const { connectToDatabase } = require('@/lib/connectDB'); // Use your path here

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
 app.use(express.json()); // Parse incoming JSON requests
 app.use(cors({ origin: ["http://localhost:3000"]}));
  // Enable CORS for all routes

// Connect to MongoDB
connectToDatabase().catch((err) => {
  console.error('Failed to connect to the database:', err);
  process.exit(1); // Exit the process if DB connection fails
});

// Example Routes (for users and events)
// Uncomment and implement these when needed
const authRoutes = require("./auth/route");
app.use("/api/auth", authRoutes);
// const userRoutes = require('./routes/userRoutes');
// const eventRoutes = require('./routes/eventRoutes');

// app.use('/api/users', userRoutes);
// app.use('/api/events', eventRoutes);

// Root Route
export async function GET(req) {
  return new Response('Welcome to the Event Management System!');
}



