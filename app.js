// app.js
import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

const app = express();


app.use(cors());

// Configurar middlewares
app.use(express.json());

// Configurar rutas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando yei");
});

// Configurar middleware para manejar errores
app.use(errorHandler);

export default app;
