import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 2️⃣ Signup User
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
console.log(username,email,password);

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Error creating user",
      error: process.env.NODE_ENV === "development" ? error.message : "Please try again later"
    });
  }
};



// 3️⃣ Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
console.log(email,password);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

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
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error logging in",
      error: process.env.NODE_ENV === "development" ? error.message : "Please try again later"
    });
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

// admin 

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Only one admin
    const ADMIN_EMAIL = "admin@admin.com";
    const ADMIN_PASSWORD = "Admin@123";

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Admin Login Successful",
      token,
      admin: { email, role: "admin" }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default {signup,login,logout,getAllProfiles,adminLogin};