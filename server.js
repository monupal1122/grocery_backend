// server.js
// Load environment variables as early as possible
import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Import routes
import catrouter from "./src/router/category.router.js"
import bannerRoutes from "./src/router/bannerRoutes.js";
import cartroute from './src/router/cartRoutes.js'
import authRouter from "./src/router/authRoutes.js";
import profile from './src/router/profileRoutes.js'
import address from './src/router/addressRoutes.js'
import order from './src/router/orderRoutes.js'
import payment from './src/router/paymentRoutes.js'
import subcategory from './src/router/subcategoryRoutes.js'

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration - IMPORTANT!
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Add your frontend URL to .env
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const bannersDir = path.join(__dirname, 'uploads/banners');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true });
  console.log('✅ Created uploads/banners directory');
}

// Serve static files - THIS IS CORRECT
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route to verify static serving
app.get('/api/test-uploads', (req, res) => {
  try {
    const files = fs.readdirSync(bannersDir);
    res.json({ 
      success: true,
      uploadsPath: uploadsDir,
      bannersPath: bannersDir,
      files: files,
      count: files.length
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message,
      uploadsPath: uploadsDir,
      bannersPath: bannersDir
    });
  }
});

// Routes
app.use("/api/banners", bannerRoutes);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartroute);
app.use("/api/profile", profile);
app.use('/api/address', address);
app.use('/api/order', order);
app.use('/api/payment', payment);
app.use('/api', subcategory);
app.use("/api", catrouter);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Connect DB
const PORT = process.env.PORT || 3000;
const mongo_Url = process.env.mongo_Url || "mongodb://127.0.0.1:27017/auth";

mongoose.connect(mongo_Url)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📁 Static files served from: ${uploadsDir}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });