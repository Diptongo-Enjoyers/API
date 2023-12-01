import express from "express";
import {
  getPets,
  getPetById,
  createPet,
  deletePet,
} from "../controllers/amezcuaVetAppController.js";
import authenticateToken from "../middlewares/authenticateToken.js";
const router = express.Router();

router.get("/", authenticateToken, getPets);
router.get("/:id", authenticateToken, getPetById);
router.post("/", authenticateToken, createPet);
router.delete("/:id", authenticateToken, deletePet);

export default router;
