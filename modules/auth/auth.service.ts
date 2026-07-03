import bcrypt from "bcrypt";
import { RegisterInput } from "./auth.types.js";
import { prisma } from "../../lib/prisma.js";

export const registerUser = async (data: RegisterInput) => {
    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existing) {
        throw new Error("User already exists");
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashed,
        },
    });

    return {
        id: user.id,
        email: user.email,
    };
};