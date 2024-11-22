import mongoose from "mongoose";

const mobileTransactionSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const MobileTransaction = mongoose.model("MobileTransaction", mobileTransactionSchema);
