import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    hostelname: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    roomtype: { type: String, required: true },
    available: { type: Boolean, required: true },
    rating: { type: Number },
    review: { type: String },
    description: { type: String },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomimage: { path: String },
    location: { type: String },
    distance: { type: Number }, // Changed to Number for numeric distances
}, { timestamps: true });

export const Listing = mongoose.model("Listing", listingSchema);
