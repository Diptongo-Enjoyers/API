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
  name: { type: String },
  address: { type: String },
  phone: { type: Number },
  clearance: {
    type: Number,
    enum: [
      config.ADMIN_CLEARANCE,
      config.WORKER_CLEARANCE,
      config.DONATOR_CLEARANCE,
      config.RECEIVER_CLEARANCE,
    ],
    required: true,
  },
  profilePictureURL: { type: String },
});

const User = mongoose.model("Users", userSchema);

export default User;
