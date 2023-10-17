import dotenv from "dotenv";
dotenv.config();

export default {
  mongoURI: process.env.MONGO_URI,
  secretKey: process.env.SECRET_KEY,
};
