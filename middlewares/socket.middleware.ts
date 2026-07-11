import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../config/env.js";
import { getUserByJwtPayload } from "../modules/auth/strategies/auth.helper.js";

interface TokenPayload extends JwtPayload {
    userId: number;
}

export async function socketAuth(
    socket: Socket,
    next: (err?: Error) => void
) {
    try {

        let token = socket.handshake.auth?.token as string | undefined;

        if (!token) {

            const authHeader = socket.handshake.headers.authorization;

            if (authHeader?.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }

        }

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

        const user = await getUserByJwtPayload(payload);

        if (!user) {
            return next(new Error("Unauthorized"));
        }

        socket.data.user = user;

        next();

    } catch {

        next(new Error("Unauthorized"));

    }
}