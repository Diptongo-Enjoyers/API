import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date },
  author: { type: String },
  image: { type: String },
});

const Pet = mongoose.model("Pet", petSchema);

export default Pet;
