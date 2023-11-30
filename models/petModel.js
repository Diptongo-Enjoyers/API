import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date },
  age: { type: String },
  author: { type: String },
  image: { type: String },
});

const Pet = mongoose.model("Pet", petSchema);

export default Pet;
