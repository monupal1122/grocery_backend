import mongoose from "mongoose";
import './user.js'
import'./addressModel.js'
import './product.js'



const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
   
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product",required: true },   
        quantity: { type: Number, required: true, min: 1 }, 
         price: { type: Number, required: true }, 
         image: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash_on_delivery", "online"], default: "cash_on_delivery" },
    paymentId: { type: String }, // Razorpay payment ID for online payments
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    deliveryStatus:{
      type: String,
      enum: ["Pending", "Confirmed", "Out for delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveryTime: { type: String }, // e.g. "15 min"
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
