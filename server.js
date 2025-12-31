// server.js
// Load environment variables as early as possible
import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
//import userRouter from "./src/router/auth.router.js"; // 👈 add .js extension
import catrouter from "./src/router/category.router.js"
import path from "path";
import { fileURLToPath } from "url";
import bannerRoutes from "./src/router/bannerRoutes.js";
import cartroute from './src/router/cartRoutes.js'
import authRouter from "./src/router/authRoutes.js";
import profile from './src/router/profileRoutes.js'
import address from './src/router/addressRoutes.js'
import order from './src/router/orderRoutes.js'
import payment from './src/router/paymentRoutes.js'
import subcategory from './src/router/subcategoryRoutes.js'



const app = express();
//multer
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(cors())
// middlewares
app.use(express.json()); // <-- parses JSON body
 // <-- parses form data
app.use(cookieParser());

// routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/banners", bannerRoutes);
//app.use("/api/auth", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartroute);
app.use("/api/profile", profile);
app.use('/api/address',address)
app.use('/api/order',order)
app.use('/api/payment',payment)
app.use('/api', subcategory)
app.use("/api", catrouter);


// connect DB
const PORT = process.env.PORT || 3000;
const mongo_Url = process.env.mongo_Url || "mongodb://127.0.0.1:27017/auth";

mongoose.connect(mongo_Url)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });
