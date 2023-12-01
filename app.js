// app.js
import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import petRoutes from "./routes/vetAppRoutes.js";
import donationsRoutes from "./routes/donationsRoutes.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";
import amezcuaPetRoutes from "./routes/amezcuaVetAppRoutes.js";
import cors from "cors";

const app = express();

app.use(cors());

// Configurar middlewares
app.use(express.json());

// Configurar rutas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/news", newsRoutes);
app.use("/donations", donationsRoutes);
app.use("/payments", paymentsRoutes);
app.use("/pets", petRoutes);
app.use("/amezcuaPets", amezcuaPetRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando yei");
});

// Configurar middleware para manejar errores
app.use(errorHandler);

export default app;
