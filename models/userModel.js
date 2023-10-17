// src/models/userModel.js
import mongoose from "mongoose";

const Admin = 0;
const Worker = 1;
const Donator = 2;
const Receiver = 3;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    required: true,
  },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  clearance: {
    type: Number,
    enum: [Admin, Worker, Donator, Receiver],
    required: true,
  },
});

const User = mongoose.model("Users", userSchema);

export default User;
