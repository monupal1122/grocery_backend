import mongoose from "mongoose";
import './user.js'

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, default: "Home" },
    fullAddress: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    pincode: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
