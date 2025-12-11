import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCart,
  getAllCarts,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controller/cartController.js";
import Cart from "../model/cartModel.js";

const router = express.Router();

// Get user's cart
router.get("/", protect, getCart);

// Get all carts (Admin)
router.get("/all", protect, getAllCarts);

// Get cart by user ID (for frontend loading)
router.get("/:userId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
    if (!cart) {
      return res.status(200).json({ cart: [] });
    }
    res.status(200).json({ cart: cart.items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save cart (for frontend persistence)
router.post("/save", protect, async (req, res) => {
  try {
    const { userId, cart } = req.body;

    let existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      existingCart.items = cart;
      await existingCart.save();
    } else {
      existingCart = new Cart({ userId, items: cart });
      await existingCart.save();
    }

    res.status(200).json({ message: "Cart saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart
router.post("/", protect, addToCart);

// Update item quantity in cart
router.put("/:productId", protect, updateCartItem);

// Remove item from cart
router.delete("/:productId", protect, removeFromCart);

// Clear entire cart
router.delete("/", protect, clearCart);

export default router;
