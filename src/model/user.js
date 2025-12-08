import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
     username: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);
export default user;
