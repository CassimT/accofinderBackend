import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    status: { type: String, required: true },
    amount: { type: String, required: true },
    phone: { type: String, required: true },
    responseCode: { type: String, required: true },
    resultCode: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", OrderSchema);
