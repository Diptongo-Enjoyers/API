import dotenv from "dotenv";

dotenv.config();

export default {
  MONGO_URI: process.env.MONGO_URI,
  SECRET_KEY: process.env.SECRET_KEY,
  ADMIN_CLEARANCE: 0,
  WORKER_CLEARANCE: 1,
  DONATOR_CLEARANCE: 2,
  RECEIVER_CLEARANCE: 3,
  USER_MAIL: process.env.USER_MAIL,
  USER_MAIL_PASSWORD: process.env.USER_MAIL_PASSWORD,
};
