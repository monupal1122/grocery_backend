import express from "express";
import { signup, login,logout,getAllProfiles,adminLogin} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

// Signup route
router.post("/signup",signup);
router.post("/login", login);
router.post("/adminlogin", adminLogin);
router.post("/logout", protect, logout);
router.get("/alluser",getAllProfiles);
router.get("/admin-dashboard", protect, isAdmin, (req, res) => {
  res.json({ success: true, message: "Welcome Admin!" });
});
export default router;
