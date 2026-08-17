// backend/routes/context.routes.js
import { Router } from "express";
import { getWeatherForCity, getUsdToMxnRate } from "../services/contextData.js";

const router = Router();

// GET /context/weather?lat=32.54&lon=-117.03
router.get("/weather", async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "lat y lon son requeridos" } });
    }
    const data = await getWeatherForCity(lat, lon);
    return res.json({ data });
  } catch (err) {
    next(err);
  }
});

// GET /context/exchange-rate
router.get("/exchange-rate", async (_req, res, next) => {
  try {
    const data = await getUsdToMxnRate();
    return res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;