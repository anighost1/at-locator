import { prisma } from "../../lib/prisma.js";

interface UserLocationRecord {
    userId: number;
    tripId: number | null;
    latitude: number;
    longitude: number;
    recordedAt: Date;
}

export async function createManyLocations(
    locations: UserLocationRecord[]
): Promise<void> {

    if (!locations.length) return;

    const values: string[] = [];

    for (const location of locations) {

        values.push(`
        (
            ${location.userId},
            ${location.tripId ?? "NULL"},
            ${location.latitude},
            ${location.longitude},
            '${location.recordedAt.toISOString()}'
        )`);

    }

    await prisma.$executeRawUnsafe(`
        INSERT INTO "UserLocation"
        (
            "userId",
            "tripId",
            "latitude",
            "longitude",
            "recordedAt"
        )
        VALUES
        ${values.join(",")}
    `);

}