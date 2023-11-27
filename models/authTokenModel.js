import mongoose from "mongoose";

const authTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  authToken: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
});

const authToken = mongoose.model("authTokens", authTokenSchema);

export default authToken;
