import dotenv from "dotenv";

dotenv.config();

export default {
  MONGO_URI: process.env.MONGO_URI,
  SECRET_KEY: process.env.SECRET_KEY,
  ADMIN_CLEARANCE: 0,
  WORKER_CLEARANCE: 1,
  DONATOR_CLEARANCE: 2,
  RECEIVER_CLEARANCE: 3,
};
