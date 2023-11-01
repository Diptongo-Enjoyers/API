// src/index.js
import app from "./app.js";
import connectDB from "./db.js";
import cors from "cors";

// Conectarse a la base de datos de MongoDB
connectDB();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Permite solicitudes desde http://localhost:3000
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  ); // Permite los métodos HTTP permitidos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Permite las cabeceras permitidas
  next();
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
