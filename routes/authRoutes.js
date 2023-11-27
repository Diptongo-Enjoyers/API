// src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  verifyAuthenticationCode,
} from "../controllers/authController.js";
import updatePassword from "../helper/passwordAuthenticator.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

// Rutas para registrarse e iniciar sesión
router.post("/register", updatePassword, register);
router.post("/login", login);
router.post("/registerWorker", register);
router.post("/logout", authenticateToken, logout);
router.post("/verifyAuthenticationCode", verifyAuthenticationCode);

export default router;
