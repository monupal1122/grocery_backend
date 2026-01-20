import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile,
  deleteProfile,
  getAllProfiles,
} from "../controller/profileController.js";
import {protect} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadProfile.js";

const router = express.Router();

router.post("/", protect, upload.single("avatar"), createOrUpdateProfile);
router.get("/my", protect, getMyProfile);
router.delete("/", protect, deleteProfile);
router.get("/all", protect, getAllProfiles);

export default router;
