import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { env } from "../../../config/env.js";
import { getUserByJwtPayload } from "./auth.helper.js";

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_SECRET,
        },
        async (payload, done) => {

            try {

                const user = await getUserByJwtPayload(payload);

                if (!user)
                    return done(null, false);

                return done(null, user);

            } catch (err) {

                return done(err, false);

            }

        }
    )
);