import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date },
  image: { type: String },
});

const News = mongoose.model("News", newsSchema);

export default News;
