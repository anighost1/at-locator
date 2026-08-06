import { Router } from "express";
import passport from "passport";
import * as tripController from "./trip.controller.js";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }))

router.post("/", tripController.createTrip)
router.get("/ongoing", tripController.getOngoingTrip)

export default router;
