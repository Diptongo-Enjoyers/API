import nodemailer from "nodemailer";
import config from "../config.js";

let transporterInstance;

export default function getTransporter() {
  if (!transporterInstance) {
    if (!config.USER_MAIL || !config.USER_MAIL_PASSWORD) {
      throw new Error(
        "Las credenciales de correo electrónico no están configuradas.",
      );
    }

    transporterInstance = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.USER_MAIL,
        pass: config.USER_MAIL_PASSWORD,
      },
    });
  }
  return transporterInstance;
}
