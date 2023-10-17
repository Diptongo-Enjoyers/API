import AppError from "../utils/AppError.js";

export default function errorHandler(error, req, res, next) {
  if (error instanceof AppError) {
    return res
      .status(error.status)
      .json({ error: { status: error.status, message: error.message } });
  } else {
    return res
      .status(500)
      .json({ error: { status: 500, message: "Internal server error" } });
  }
}
