import Express from "express";

import{
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews  
} from "../controllers/newsController.js";

import authenticateToken from "../middlewares/authenticateToken.js";

const router = Express.Router();

// Rutas para obtener y modificar los datos de las noticias

router.get("/", authenticateToken, getNews);
router.get("/:id", authenticateToken, getNewsById);
router.post("/createNews", authenticateToken, createNews);
router.patch("/:id", authenticateToken, updateNews);
router.delete("/:id", authenticateToken, deleteNews);

export default router;