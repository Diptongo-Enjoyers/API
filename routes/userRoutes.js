// src/routes/userRoutes.js
import express from "express";

import {
  getUsers,
  getUserById,
  getMe,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get("/", authenticateToken, getUsers);
router.get("/:id", authenticateToken, getUserById);
router.get("/me", authenticateToken, getMe);
router.patch("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
