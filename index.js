// src/index.js
import app from "./app.js";
import connectDB from "./db.js";
import cors from "cors";

// Conectarse a la base de datos de MongoDB
connectDB();

app.use(cors({ origin: true, credentials: true }));

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
