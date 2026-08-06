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