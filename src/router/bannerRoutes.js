import express from "express";
import {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
} from "../controller/bannerController.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// 🟢 Create Banner (upload image)
router.post("/", upload.single("image"), createBanner);

// 🟡 Get all banners
router.get("/", getAllBanners);

// 🟣 Update banner (optionally upload new image)
router.put("/:id", upload.single("image"), updateBanner);

// 🔴 Delete banner
router.delete("/:id", deleteBanner);

export default router;
