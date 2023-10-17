import mongoose from "mongoose";

const materialDonationSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  creationDate: { type: Date, required: true },
  receptionDate: { type: Date, required: true },
  status: { type: String, required: true },
});

const MaterialDonation = mongoose.model(
  "MaterialDonations",
  materialDonationSchema,
);

export default MaterialDonation;

