import mongoose from "mongoose";
import "./user.js"


const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String },
    phoneNumber: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    profileImage: { type: String }, // store file path or URI
    bio: { type: String },
    email: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
