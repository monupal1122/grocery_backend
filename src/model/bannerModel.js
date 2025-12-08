import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Multer will save the uploaded file path here
    imageUrl: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
    },
    bannerType: {
      type: String,
      enum: ["home", "category", "offer", "festival", "flashsale"],
      default: "home",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    priority: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
