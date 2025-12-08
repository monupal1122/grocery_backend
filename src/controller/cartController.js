import Cart from "../model/cartModel.js";
import Product from "../model/product.js";

/**
 * @desc Get user's cart
 * @route GET /api/cart
 * @access Private
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Get all carts (Admin)
 * @route GET /api/carts/all
 * @access Private/Admin
 */
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("userId", "name email").populate("items.productId", "name price image");
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Add item to cart
 * @route POST /api/cart
 * @access Private
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Product ID and valid quantity required" });
    }

    // Check if product exists
    const product = await Product.findById({productId});
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Update item quantity in cart
 * @route PUT /api/cart/:productId
 * @access Private
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid quantity required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Remove item from cart
 * @route DELETE /api/cart/:productId
 * @access Private
 */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Clear cart
 * @route DELETE /api/cart
 * @access Private
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndDelete({ userId });

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
