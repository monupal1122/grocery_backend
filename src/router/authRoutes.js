import express from "express";
import {  login, verifyOtp, logout,getAllProfiles } from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/logout", protect, logout);
router.get("/alluser",getAllProfiles);

// Check environment variables (for debugging)
router.get("/check-env", (req, res) => {
	res.json({
		success: true,
		environment: {
			GMAIL_USER: process.env.GMAIL_USER ? "✅ SET" : "❌ NOT SET",
			GMAIL_PASS: process.env.GMAIL_PASS ? "✅ SET" : "❌ NOT SET",
			JWT_SECRET: process.env.JWT_SECRET ? "✅ SET" : "❌ NOT SET",
			mongo_Url: process.env.mongo_Url ? "✅ SET" : "❌ NOT SET",
			NODE_ENV: process.env.NODE_ENV || "not set",
			PORT: process.env.PORT || "not set"
		},
		// Show partial values for debugging (not full secrets)
		values: {
			GMAIL_USER: process.env.GMAIL_USER ? `${process.env.GMAIL_USER.substring(0, 3)}***@${process.env.GMAIL_USER.split('@')[1] || ''}` : null,
			GMAIL_PASS: process.env.GMAIL_PASS ? "*** (length: " + process.env.GMAIL_PASS.length + ")" : null,
			JWT_SECRET: process.env.JWT_SECRET ? "*** (set)" : null
		}
	});
});

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
