import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MaterialDonations",
    required: true,
  },
  creationDate: { type: Date, required: true },
  receptionDate: { type: Date, required: true },
  status: { type: String, required: true },
});

const Item = mongoose.model("Items", itemSchema);

export default Item;
