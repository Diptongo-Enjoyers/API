// src/routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import updatePassword from "../helper/passwordAuthenticator.js";

const router = express.Router();

// Rutas para registrarse e iniciar sesión
router.post("/register", updatePassword, register);
router.post("/login", login);
router.post("/registerWorker", register);

export default router;
