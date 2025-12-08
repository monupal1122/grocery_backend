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

    // Send real email
    let emailSent = false;
    try {
      await sendEmail(
        email,
        "Your Blinkit OTP Code",
        `Your OTP is: ${otp}\n\nThis OTP expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.`
      );
      emailSent = true;
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // Even if email fails, send response with OTP for development
      // In production, you might want to reject the request
    }

    res.status(200).json({
      message: emailSent ? "OTP sent to your email" : "OTP generated (email sending in progress)",
      email,
      otp: process.env.NODE_ENV === "development" ? otp : undefined, // Show OTP in dev mode only
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