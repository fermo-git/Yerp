import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import crossingsRoutes from "./routes/crossings.routes.js";
import cron from "node-cron";
import { syncWaitTimesFromCBP } from "./services/cbpSync.js";
import { recalculatePatterns } from "./services/patternAggregation.js";
import contextRoutes from "./routes/context.routes.js";
import businessRoutes, { isMulterError, multerMessages } from "./routes/businesses.routes.js";
import geoRoutes from "./routes/geo.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, "uploads");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })
);
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

// Sirve las imágenes subidas. En producción conviene un bucket/CDN.
// El directorio se garantiza en arranque (almacenamiento fuera del webroot).
await mkdir(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/marketplace", marketplaceRoutes);
app.use("/api/v1/crossings", crossingsRoutes);
app.use("/api/v1/context", contextRoutes);
app.use("/api/v1/businesses", businessRoutes);
app.use("/api/v1/geo", geoRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Ruta no encontrada" } });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: err.issues?.[0]?.message ?? "Datos inválidos",
      },
    });
  }
  if (isMulterError(err)) {
    return res.status(400).json({
      error: {
        code: err.code || "UPLOAD_ERROR",
        message: multerMessages[err.code] ?? err.message,
      },
    });
  }
  if (err?.code === "LIMIT_FILE_SIZE" || err?.code === "IMAGE_TOO_SMALL" || err?.code === "WRONG_ASPECT_RATIO" || err?.code === "INVALID_IMAGE_TYPE" || err?.code === "INVALID_IMAGE") {
    return res.status(400).json({
      error: { code: "UPLOAD_VALIDATION", message: err.message ?? "Imagen inválida" },
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

cron.schedule("*/15 * * * *", async () => {
  try {
    await syncWaitTimesFromCBP();
  } catch (err) {
    console.error("[cbpSync] Error en sincronización programada:", err);
  }
});

syncWaitTimesFromCBP().catch((err) =>
  console.error("[cbpSync] Error en sincronización inicial:", err)
);

cron.schedule("0 3 * * *", async () => {
  try {
    await recalculatePatterns();
  } catch (err) {
    console.error("[patternAggregation] Error:", err);
  }
});