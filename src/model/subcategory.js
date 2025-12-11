import mongoose from "mongoose";
import "./category.js";

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true }
  },
  { timestamps: true }
);

const SubcategoryModel = mongoose.model("Subcategory", subcategorySchema);
export default SubcategoryModel;
