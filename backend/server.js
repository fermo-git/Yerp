import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Ruta no encontrada" } });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: err.issues?.[0]?.message ?? "Datos inválidos" },
    });
  }
  console.error(err);
  return res.status(500).json({
    error: { code: "INTERNAL", message: "Error interno del servidor" },
  });
});

app.listen(PORT, () => {
  console.log(`La Frontera API escuchando en http://localhost:${PORT}`);
});
