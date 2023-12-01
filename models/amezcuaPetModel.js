import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: String },
  weight: { type: String },
  imageURL: { type: String },
});

const Pet = mongoose.model("amezcuaPets", petSchema);

export default Pet;
