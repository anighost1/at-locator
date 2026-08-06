import { Router } from "express";
import authRoutes from "../modules/auth/auth.route.js";
import tripRoutes from "../modules/trip/trip.route.js";

const router = Router();

router.get("/health", (_req, res) => {
    res.json({ status: "OK" });
});
router.use("/auth", authRoutes);
router.use("/trip", tripRoutes);

export default router;
