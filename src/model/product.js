import mongoose from "mongoose";
import "./category.js";
import "./subcategory.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    //image: { type: String, required: true },
    images: [
    {
      type: String, // will store image URLs
      required: true
    }
  ],
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    stock: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
