// src/routes/authRoutes.js
import express from "express";
import {
  getPets,
  getPetById,
  createPet,
  deletePet,
} from "../controllers/vetAppController.js";
import authenticateToken from "../middlewares/authenticateToken.js";
const router = express.Router();

router.get("/", getPets, authenticateToken);
router.get("/:id", getPetById, authenticateToken);
router.post("/", createPet, authenticateToken);

export default router;
