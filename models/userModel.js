// src/models/userModel.js
import mongoose from "mongoose";
import config from "../config.js";

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
    enum: [config.ADMIN, config.WORKER, config.DONATOR, config.RECEIVER],
    required: true,
  },
});

const User = mongoose.model("Users", userSchema);

export default User;
