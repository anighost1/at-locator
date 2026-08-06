import { Router } from "express";
import passport from "passport";
import * as tripController from "./trip.controller.js";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }))

router.get("/ongoing", tripController.getOngoingTrip)
router.post("/", tripController.createTrip)
router.get("/", tripController.getTripList)
router.get("/summary/:tripId", tripController.getTripSummary)
router.put("/end/:tripId", tripController.endTrip)

export default router;
