import jwt from "jsonwebtoken";
import User from "../model/user.js";
// ✅ Middleware with DB check (ensures user exists)
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user without password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } else {
      res.status(401).json({ message: "Not authorized, token missing" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
};

export default {protect}