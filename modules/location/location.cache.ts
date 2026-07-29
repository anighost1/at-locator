import redis from "../../config/redis.js";
import { LocationPayload } from "./location.types.js";

export async function setLatestLocation(data: LocationPayload) {
    await redis.hSet(`location:${data.userId}`, {
        latitude: data.latitude.toString(),
        longitude: data.longitude.toString(),
        speed: String(data.speed ?? 0),
        heading: String(data.heading ?? 0),
        accuracy: String(data.accuracy ?? 0),
        recordedAt: data.recordedAt,
        tripId: data.tripId,
    });
}

export async function getLatestLocation(userId: string) {
    return await redis.hGetAll(`location:${userId}`);
}

export async function removeLatestLocation(userId: string) {
    await redis.del(`location:${userId}`);
}