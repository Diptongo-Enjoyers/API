import Express from "express";

import { postIntents } from "../controllers/paymentsController.js";

import authenticateToken from "../middlewares/authenticateToken.js";

const router = Express.Router();

router.post("/intents", authenticateToken, postIntents);

export default router;
