import mongoose from "mongoose";
import User from "./userModel.js";

const monetaryDonationSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const MonetaryDonation = mongoose.model(
  "MonetaryDonations",
  monetaryDonationSchema,
);

export default MonetaryDonation;
