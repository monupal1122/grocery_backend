import express from "express";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAllAddresses,
} from "../controller/addressController.js";
import { protect as verifyToken } from "../middleware/authMiddleware.js"; // optional if you have auth

const router = express.Router();

router.post("/", verifyToken, addAddress);
router.get("/", verifyToken, getAddresses);
router.put("/:id", verifyToken, updateAddress);
router.delete("/:id", verifyToken, deleteAddress);
router.patch("/:id/default", verifyToken, setDefaultAddress);
router.get("/all", verifyToken, getAllAddresses);

export default router;
