import User from "../model/user.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

// 2️⃣ Login User (Send OTP)
export const login = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email required" });
    }

    let user = await User.findOne({ email });

    // Create new user if doesn't exist
    if (!user) {
      user = await User.create({ username, email });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // Save OTP and expiry
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // For testing — show OTP in console (FOR DEV ONLY)
    console.log(`✅ OTP for ${email}: ${otp}`);

    // Check if email credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("❌ Email credentials not configured (GMAIL_USER or GMAIL_PASS missing)");
      // Return OTP in response for development/testing when credentials are missing
      return res.status(200).json({
        message: "OTP generated. Email service not configured. Check backend logs for OTP.",
        email,
        otp: otp, // Include OTP in response when email service unavailable
        emailSent: false,
        warning: "Email service not configured. Please set GMAIL_USER and GMAIL_PASS environment variables in Render."
      });
    }

    // Send real email
    let emailSent = false;
    let emailError = null;
    try {
      console.log(`📧 Attempting to send email to: ${email}`);
      console.log(`📧 Using Gmail account: ${process.env.GMAIL_USER ? process.env.GMAIL_USER.substring(0, 3) + '***' : 'NOT SET'}`);
      
      await sendEmail(
        email,
        "Your Blinkit OTP Code",
        `Your OTP is: ${otp}\n\nThis OTP expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.`
      );
      emailSent = true;
      console.log(`✅ Email sent successfully to ${email}`);
    } catch (err) {
      emailError = err;
      console.error("❌ Email sending failed!");
      console.error("❌ Error message:", err.message);
      console.error("❌ Error code:", err.code);
      console.error("❌ Error response:", err.response?.message || err.response);
      console.error("❌ Full error object:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      
      // Log specific Gmail errors
      if (err.code === 'EAUTH' || err.responseCode === 535) {
        console.error("❌ AUTHENTICATION ERROR: Invalid Gmail credentials!");
        console.error("   - Make sure you're using Gmail App Password (not regular password)");
        console.error("   - App Password should be 16 characters");
        console.error("   - 2-Step Verification must be enabled");
      }
      if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT') {
        console.error("❌ CONNECTION ERROR: Could not connect to Gmail servers");
      }
    }

    // If email failed, still return success but include OTP and warning
    // This allows testing even if email service has issues
    if (!emailSent) {
      const errorMessage = emailError?.message || emailError?.response?.message || "Unknown email error";
      const errorCode = emailError?.code || emailError?.responseCode || "UNKNOWN";
      
      return res.status(200).json({
        message: "OTP generated but email sending failed. Check backend logs for OTP.",
        email,
        otp: otp, // Include OTP so user can still test
        emailSent: false,
        error: errorMessage,
        errorCode: errorCode,
        warning: errorCode === 'EAUTH' || errorCode === 535 
          ? "Gmail authentication failed. Please check your Gmail App Password in Render environment variables."
          : "Email service error. Please check backend logs and Gmail credentials in Render environment variables."
      });
    }

    // Success - email sent
    res.status(200).json({
      message: "OTP sent to your email",
      email,
      otp: process.env.NODE_ENV === "development" ? otp : undefined, // Show OTP in dev mode only
      emailSent: true
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Error logging in", 
      error: process.env.NODE_ENV === "development" ? error.message : "Please try again later" 
    });
  }
};

// 3️⃣ Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { username, email, otp } = req.body;

    if (!username || !email || !otp) {
      return res.status(400).json({ message: "Username, email, and OTP required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check OTP & Expiry
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ Clear OTP after verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    console.log(`✅ OTP verified for ${email}`);
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Final response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

// 4️⃣ Logout User
export const logout = async (req, res) => {
  try {
    // Since JWT is stateless, logout is handled on client side by removing token
    // But we can optionally blacklist the token or just respond with success
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error: error.message });
  }
};


export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await User.find().populate( "email");
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};