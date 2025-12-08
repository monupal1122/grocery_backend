import express from "express";
import {  login, verifyOtp, logout,getAllProfiles } from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/logout", protect, logout);
router.get("/alluser",getAllProfiles);

// Test endpoint to verify email configuration
router.get("/test-email", async (req, res) => {
	try {
		const nodemailer = await import("nodemailer");
		const transporter = nodemailer.default.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		});

		// Verify connection
		await transporter.verify();
		res.status(200).json({
			success: true,
			message: "✅ Email configuration is working",
			gmail_user: process.env.GMAIL_USER,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "❌ Email configuration error",
			error: error.message,
		});
	}
});

export default router;
