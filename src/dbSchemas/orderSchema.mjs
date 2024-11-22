import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order_reference: {
      type: String,
      unique: true,
      required: true,
    },
    payment_page_URL: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: "PENDING", // Initial status
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
