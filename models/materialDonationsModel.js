import mongoose from "mongoose";
import User from "./userModel.js";

const materialItemSchema = new mongoose.Schema({
  food: { type: String, required: true },
  key: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const materialDonationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  materials: [materialItemSchema], // Array de objetos material
  creationDate: { type: Date, required: true },
  receptionDate: { type: Date, required: true },
  status: { type: String, required: true },
});

const MaterialDonation = mongoose.model(
  "MaterialDonations",
  materialDonationSchema
);

export default MaterialDonation;
