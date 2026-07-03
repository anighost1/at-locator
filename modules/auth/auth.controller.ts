import { Request, Response } from "express";
import * as authService from "./auth.service.js";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

export const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json(user);
    } catch (err: any) {
        logger.error(`Registration failed: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;

        const token = jwt.sign(
            { userId: user.id },
            env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        res.json({ token });
    } catch (err: any) {
        logger.error(`Login failed: ${err.message}`);
        res.status(500).json({ message: "Login failed" });
    }
};