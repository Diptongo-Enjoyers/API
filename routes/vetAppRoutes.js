// src/routes/authRoutes.js
import express from "express";
import {
    getPets,
    getPetById,
    createPet,
    deletePet,
} from "../controllers/vetAppController.js";

const router = express.Router();


router.get("/", getPets);
router.get("/:id", getPetById);
router.post("/", createPet);
router.delete("/:id", deletePet);

export default router;

