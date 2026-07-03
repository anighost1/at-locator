import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../../../lib/prisma.js";
import { env } from "../../../config/env.js";

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_SECRET,
        },
        async (payload, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: payload.userId, isActive: true },
                });

                if (!user) return done(null, false);

                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);