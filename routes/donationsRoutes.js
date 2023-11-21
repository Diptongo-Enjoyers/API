// src/routes/authRoutes.js
import express from "express";
import { getMonetaryDonations, getMaterialDonations, getDonations, getMonetaryDonationById, getMaterialDonationById, registerMonetaryDonation, registerMaterialDonation, updateMonetaryDonation, updateMaterialDonation, deleteMonetaryDonation, deleteMaterialDonation } from "../controllers/donationsController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

// Rutas para las donaciones
router.get("/monetary", authenticateToken, getMonetaryDonations);   
router.get("/material", authenticateToken, getMaterialDonations);
router.get("/", authenticateToken, getDonations);
router.get("/monetary/:id", authenticateToken, getMonetaryDonationById);
router.get("/material/:id", authenticateToken, getMaterialDonationById);
router.post("/monetary", authenticateToken, registerMonetaryDonation);
router.post("/material", authenticateToken, registerMaterialDonation);
router.patch("/monetary/:id", authenticateToken, updateMonetaryDonation);
router.patch("/material/:id", authenticateToken, updateMaterialDonation);
router.delete("/monetary/:id", authenticateToken, deleteMonetaryDonation);
router.delete("/material/:id", authenticateToken, deleteMaterialDonation);

export default router;
