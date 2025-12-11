import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  getOrdersByUser,
  updateOrdersByUser,
} from "../controller/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getUserOrders);
router.get("/user/:id", protect, getOrderById);
router.put("/:id/status",updateOrderStatus);
router.get("/all",getAllOrders);
router.delete("/:id", protect, deleteOrder);
router.get("/by-user", protect, getOrdersByUser);
router.put("/user/:userId/status", protect, updateOrdersByUser);

export default router;
