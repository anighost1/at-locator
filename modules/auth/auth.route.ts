import { Router } from "express";
import passport from "passport";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register", authController.register);

router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    authController.login
);

router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({ user: req.user });
    }
);

export default router;
