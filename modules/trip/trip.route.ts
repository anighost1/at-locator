import { Router } from "express";
import passport from "passport";
import * as tripController from "./trip.controller.js";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }))

router.get("/ongoing", tripController.getOngoingTrip)
router.post("/", tripController.createTrip)
router.get("/", tripController.getTripList)

export default router;
