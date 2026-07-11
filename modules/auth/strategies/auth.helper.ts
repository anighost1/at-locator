import { prisma } from "../../../lib/prisma.js";

interface JwtPayload {
    userId: number;
}

export async function getUserByJwtPayload(payload: JwtPayload) {
    return prisma.user.findFirst({
        where: {
            id: payload.userId,
            isActive: true,
        },
    });
}