import { TripInput } from "./trip.types.js";
import { prisma } from "../../lib/prisma.js";

export const createTrip = async (data: TripInput) => {

    const ongoingTrip = await prisma.trip.count({
        where: {
            users: {
                some: {
                    userId: data?.userId,
                }
            },
            endedAt: null
        }
    })

    if (ongoingTrip > 0) {
        throw new Error("You already have an ongoing trip. Please end it before creating a new one.");
    }

    const trip = await prisma.trip.create({
        data: {
            name: data?.name,
            users: {
                create: {
                    userId: data?.userId
                }
            }
        }
    })

    const tripCode = `${trip?.name ? trip?.name?.toLowerCase().replace(/\s+/g, "") : 'trip'}-${trip.id}`;

    return {
        ...trip,
        tripCode
    };
};

export const getOngoingTrip = async (data: { userId: number }) => {
    const trip = await prisma.trip.findFirst({
        where: {
            users: {
                some: {
                    userId: data?.userId,
                }
            },
            endedAt: null
        }
    });

    if (!trip) {
        throw new Error("No ongoing trip found for the user.");
    }

    const tripCode = `${trip?.name ? trip?.name?.toLowerCase().replace(/\s+/g, "") : 'trip'}-${trip.id}`;

    return {
        ...trip,
        tripCode
    };
};

export const getTripList = async (data: { userId: number }) => {
    const trips = await prisma.trip.findMany({
        where: {
            users: {
                some: {
                    userId: data?.userId,
                }
            }
        },
        orderBy: {
            startedAt: 'desc'
        }
    });

    return trips;
};

export const getTripSummary = async (data: { tripId: number }) => {
    const result: any = await prisma.$queryRaw`
        WITH ordered_locations AS (
            SELECT
                "userId",
                "tripId",
                latitude,
                longitude,
                speed,
                heading,
                accuracy,
                "recordedAt",
                geom,

                LAG(geom) OVER (
                    PARTITION BY "userId"
                    ORDER BY "recordedAt"
                ) AS prev_geom,

                LAG("recordedAt") OVER (
                    PARTITION BY "userId"
                    ORDER BY "recordedAt"
                ) AS prev_time

            FROM "UserLocation"
            WHERE "tripId" = ${data?.tripId}
        )

        SELECT
            "userId",

            COUNT(*)::int AS "totalPoints",

            MIN("recordedAt") AS "startTime",
            MAX("recordedAt") AS "endTime",

            ROUND(
                (SUM(
                    COALESCE(ST_Distance(prev_geom, geom),0)
                ) / 1000)::numeric,
                2
            ) AS "distanceKm",

            MAX(speed) AS "topSpeed",

            ROUND(AVG(speed)::numeric,2) AS "averageSpeed",

            EXTRACT(
                EPOCH FROM (
                    MAX("recordedAt") - MIN("recordedAt")
                )
            )::int AS "durationSeconds",

            json_agg(
                json_build_object(
                    'latitude', latitude,
                    'longitude', longitude,
                    'speed', speed,
                    'heading', heading,
                    'accuracy', accuracy,
                    'recordedAt', "recordedAt"
                )
                ORDER BY "recordedAt"
            ) AS points

        FROM ordered_locations
        GROUP BY "userId"
        ORDER BY "userId";
        `;

    return result;
}

export const endTrip = async (data: { tripId: number, userId: number }) => {
    const creator = await prisma.tripUser.findFirst({
        where: {
            tripId: data.tripId,
        },
        select: {
            userId: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    if (creator?.userId !== data?.userId) {
        throw new Error("Only creator of the trip can end it.");
    }

    const trip = await prisma.trip.update({
        where: { id: data.tripId },
        data: { endedAt: new Date() }
    });
    return trip;
};