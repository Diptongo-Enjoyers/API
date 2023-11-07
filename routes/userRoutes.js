// src/routes/userRoutes.js
import express from "express";

import {
  getUsers,
  getUserById,
  getMe,
  updateUser,
  updateMe,
  updatePassword,
  deleteUser,
} from "../controllers/userController.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import passwordAuthenticator from "../helper/passwordAuthenticator.js";

const router = express.Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get("/", authenticateToken, getUsers);
router.get("/getMe", authenticateToken, getMe);
router.patch("/updateMe", authenticateToken, updateMe);
router.get("/:id", authenticateToken, getUserById);
router.patch("/updatePassword", authenticateToken, passwordAuthenticator, updatePassword);
router.patch("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
