import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import passport from "passport";
import rateLimit from "express-rate-limit";

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // limit each IP
    message: {
        success: false,
        message: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // stricter
    message: {
        success: false,
        message: "Too many login attempts. Try again later.",
    },
});

import "./modules/auth/strategies/local.strategy.js";
import "./modules/auth/strategies/jwt.strategy.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(globalLimiter);

app.get("/", (_req, res) => {
    res.send("Baby Bloom API running ");
});

app.use("/api/auth", authLimiter);
app.use("/api", routes);

export default app;
