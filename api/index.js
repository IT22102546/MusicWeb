import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import musicRoute from "./routes/music.route.js";
import categoryRoute from "./routes/category.route.js";
import stripe from "./routes/stripe.route.js";
import membership from "./routes/membership.route.js";
import contactRoutes from "./routes/contact.route.js";
import path from 'path';
import fs from 'fs';

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'https://amusicbible.com',
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/music", musicRoute);
app.use("/api/category", categoryRoute);
app.use("/api/stripe", stripe);
app.use("/api/membership", membership);
app.use('/api/contact', contactRoutes);

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is running successfully!" });
});

// Serve Static Frontend Files
const __dirname = path.resolve();
const distPath = path.join(__dirname, "Frontend/dist");

if (!fs.existsSync(distPath)) {
  console.error(`Dist directory not found at ${distPath}`);
  process.exit(1);
}

app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log("Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("Mongoose connection closed.");
    process.exit(0);
  });
});

// Start Server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on Port ${process.env.PORT || 3000}`);
});
