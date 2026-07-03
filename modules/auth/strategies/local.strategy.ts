import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma.js";

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: { email, isActive: true },
                });

                if (!user)
                    return done(null, false, { message: "Invalid credentials" });

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch)
                    return done(null, false, { message: "Invalid credentials" });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);