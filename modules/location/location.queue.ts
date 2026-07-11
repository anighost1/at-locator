import redis from "../../config/redis.js";
import { LocationPayload } from "./location.types.js";

const STREAM_NAME = "gps_stream";

export async function addLocation(data: LocationPayload) {
    await redis.xAdd("gps_stream", "*", {
        userId: String(data.userId),
        tripId: String(data.tripId ?? ""),
        latitude: String(data.latitude),
        longitude: String(data.longitude),
        speed: String(data.speed ?? 0),
        heading: String(data.heading ?? 0),
        accuracy: String(data.accuracy ?? 0),
        recordedAt: data.recordedAt,
    });
}

export { STREAM_NAME };